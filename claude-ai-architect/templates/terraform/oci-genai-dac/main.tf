# OCI GenAI Dedicated AI Cluster - Production Template
# Usage: terraform init && terraform plan && terraform apply

terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 5.0.0"
    }
  }
}

# ==============================================================================
# VARIABLES
# ==============================================================================

variable "tenancy_ocid" {
  description = "OCI Tenancy OCID"
  type        = string
}

variable "compartment_id" {
  description = "Compartment for GenAI resources"
  type        = string
}

variable "region" {
  description = "OCI Region (must support GenAI)"
  type        = string
  default     = "us-chicago-1"

  validation {
    condition = contains([
      "us-chicago-1",
      "us-ashburn-1",
      "eu-frankfurt-1",
      "uk-london-1",
      "ap-tokyo-1"
    ], var.region)
    error_message = "Region must support OCI GenAI service."
  }
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "genai-production"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

# Hosting Cluster Config
variable "hosting_cluster_units" {
  description = "Number of hosting cluster units (1 unit = 1 endpoint slot)"
  type        = number
  default     = 10

  validation {
    condition     = var.hosting_cluster_units >= 1 && var.hosting_cluster_units <= 50
    error_message = "Hosting cluster units must be between 1 and 50."
  }
}

variable "hosting_unit_shape" {
  description = "Hosting cluster shape"
  type        = string
  default     = "LARGE_COHERE"

  validation {
    condition     = contains(["LARGE_COHERE", "LARGE_GENERIC", "SMALL_COHERE"], var.hosting_unit_shape)
    error_message = "Must be a valid unit shape."
  }
}

# Model Config
variable "model_id" {
  description = "Model to deploy (e.g., cohere.command-r-plus)"
  type        = string
  default     = "cohere.command-r-plus"
}

variable "enable_content_moderation" {
  description = "Enable content moderation on endpoint"
  type        = bool
  default     = true
}

# Fine-tuning Config
variable "enable_finetuning_cluster" {
  description = "Create a fine-tuning cluster"
  type        = bool
  default     = false
}

variable "finetuning_cluster_units" {
  description = "Number of fine-tuning cluster units"
  type        = number
  default     = 4
}

# Tags
variable "freeform_tags" {
  description = "Freeform tags for resources"
  type        = map(string)
  default     = {}
}

# ==============================================================================
# LOCALS
# ==============================================================================

locals {
  common_tags = merge(var.freeform_tags, {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Service     = "GenAI"
  })
}

# ==============================================================================
# DATA SOURCES
# ==============================================================================

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

# ==============================================================================
# HOSTING CLUSTER
# ==============================================================================

resource "oci_generative_ai_dedicated_ai_cluster" "hosting" {
  compartment_id = var.compartment_id
  type           = "HOSTING"

  unit_count = var.hosting_cluster_units
  unit_shape = var.hosting_unit_shape

  display_name = "${var.project_name}-hosting-cluster"
  description  = "Production hosting cluster for ${var.project_name}"

  freeform_tags = local.common_tags

  lifecycle {
    prevent_destroy = true # Protect production cluster
  }
}

# ==============================================================================
# GENAI ENDPOINT
# ==============================================================================

resource "oci_generative_ai_endpoint" "primary" {
  compartment_id          = var.compartment_id
  dedicated_ai_cluster_id = oci_generative_ai_dedicated_ai_cluster.hosting.id
  model_id                = var.model_id

  display_name = "${var.project_name}-primary-endpoint"
  description  = "Primary inference endpoint"

  content_moderation_config {
    is_enabled = var.enable_content_moderation
  }

  freeform_tags = local.common_tags

  depends_on = [oci_generative_ai_dedicated_ai_cluster.hosting]
}

# ==============================================================================
# FINE-TUNING CLUSTER (OPTIONAL)
# ==============================================================================

resource "oci_generative_ai_dedicated_ai_cluster" "finetuning" {
  count = var.enable_finetuning_cluster ? 1 : 0

  compartment_id = var.compartment_id
  type           = "FINE_TUNING"

  unit_count = var.finetuning_cluster_units
  unit_shape = var.hosting_unit_shape

  display_name = "${var.project_name}-finetuning-cluster"
  description  = "Fine-tuning cluster for ${var.project_name}"

  freeform_tags = local.common_tags
}

# ==============================================================================
# IAM POLICIES
# ==============================================================================

resource "oci_identity_policy" "genai_admins" {
  compartment_id = var.tenancy_ocid
  name           = "${var.project_name}-genai-admins"
  description    = "Allow GenAI administrators to manage resources"

  statements = [
    "Allow group GenAI-Admins to manage generative-ai-family in compartment id ${var.compartment_id}",
    "Allow group GenAI-Admins to manage object-family in compartment id ${var.compartment_id}",
  ]

  freeform_tags = local.common_tags
}

resource "oci_identity_policy" "genai_users" {
  compartment_id = var.tenancy_ocid
  name           = "${var.project_name}-genai-users"
  description    = "Allow GenAI users to use endpoints"

  statements = [
    "Allow group GenAI-Users to use generative-ai-endpoints in compartment id ${var.compartment_id}",
    "Allow group GenAI-Users to read generative-ai-models in compartment id ${var.compartment_id}",
  ]

  freeform_tags = local.common_tags
}

# ==============================================================================
# OUTPUTS
# ==============================================================================

output "hosting_cluster_id" {
  description = "Hosting cluster OCID"
  value       = oci_generative_ai_dedicated_ai_cluster.hosting.id
}

output "hosting_cluster_state" {
  description = "Hosting cluster state"
  value       = oci_generative_ai_dedicated_ai_cluster.hosting.lifecycle_state
}

output "primary_endpoint_id" {
  description = "Primary endpoint OCID"
  value       = oci_generative_ai_endpoint.primary.id
}

output "primary_endpoint_url" {
  description = "Primary endpoint inference URL"
  value       = "https://inference.generativeai.${var.region}.oci.oraclecloud.com"
}

output "finetuning_cluster_id" {
  description = "Fine-tuning cluster OCID (if enabled)"
  value       = var.enable_finetuning_cluster ? oci_generative_ai_dedicated_ai_cluster.finetuning[0].id : null
}

output "model_deployed" {
  description = "Model deployed on primary endpoint"
  value       = var.model_id
}

output "cluster_capacity" {
  description = "Hosting cluster capacity"
  value = {
    units          = var.hosting_cluster_units
    max_endpoints  = var.hosting_cluster_units
    current_endpoints = 1
    available_slots = var.hosting_cluster_units - 1
  }
}
