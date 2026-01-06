# Security Baseline for AI Workloads
# Terraform configuration for OCI security best practices

terraform {
  required_version = ">= 1.0"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 5.0"
    }
  }
}

# Variables
variable "tenancy_ocid" {
  description = "OCI Tenancy OCID"
  type        = string
}

variable "compartment_id" {
  description = "Compartment for security resources"
  type        = string
}

variable "region" {
  description = "OCI Region"
  type        = string
  default     = "us-chicago-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "ai-security"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

# VCN with proper segmentation
resource "oci_core_vcn" "ai_vcn" {
  compartment_id = var.compartment_id
  cidr_blocks    = ["10.0.0.0/16"]
  display_name   = "${var.project_name}-vcn-${var.environment}"
  dns_label      = "${var.project_name}${var.environment}"

  freeform_tags = local.common_tags
}

# Internet Gateway (for public subnet only)
resource "oci_core_internet_gateway" "igw" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.ai_vcn.id
  display_name   = "${var.project_name}-igw"
  enabled        = true

  freeform_tags = local.common_tags
}

# NAT Gateway (for private subnets)
resource "oci_core_nat_gateway" "nat" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.ai_vcn.id
  display_name   = "${var.project_name}-nat"

  freeform_tags = local.common_tags
}

# Service Gateway (for OCI services)
resource "oci_core_service_gateway" "sgw" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.ai_vcn.id
  display_name   = "${var.project_name}-sgw"

  services {
    service_id = data.oci_core_services.all_services.services[0].id
  }

  freeform_tags = local.common_tags
}

# Public Subnet (DMZ - for load balancers only)
resource "oci_core_subnet" "public" {
  compartment_id             = var.compartment_id
  vcn_id                     = oci_core_vcn.ai_vcn.id
  cidr_block                 = "10.0.1.0/24"
  display_name               = "${var.project_name}-public-${var.environment}"
  dns_label                  = "public"
  prohibit_public_ip_on_vnic = false

  route_table_id    = oci_core_route_table.public.id
  security_list_ids = [oci_core_security_list.public.id]

  freeform_tags = local.common_tags
}

# Private Subnet (Application tier)
resource "oci_core_subnet" "private_app" {
  compartment_id             = var.compartment_id
  vcn_id                     = oci_core_vcn.ai_vcn.id
  cidr_block                 = "10.0.10.0/24"
  display_name               = "${var.project_name}-private-app-${var.environment}"
  dns_label                  = "privateapp"
  prohibit_public_ip_on_vnic = true

  route_table_id    = oci_core_route_table.private.id
  security_list_ids = [oci_core_security_list.private_app.id]

  freeform_tags = local.common_tags
}

# Private Subnet (Data tier - for GenAI, databases)
resource "oci_core_subnet" "private_data" {
  compartment_id             = var.compartment_id
  vcn_id                     = oci_core_vcn.ai_vcn.id
  cidr_block                 = "10.0.20.0/24"
  display_name               = "${var.project_name}-private-data-${var.environment}"
  dns_label                  = "privatedata"
  prohibit_public_ip_on_vnic = true

  route_table_id    = oci_core_route_table.private.id
  security_list_ids = [oci_core_security_list.private_data.id]

  freeform_tags = local.common_tags
}

# Route Tables
resource "oci_core_route_table" "public" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.ai_vcn.id
  display_name   = "${var.project_name}-public-rt"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.igw.id
  }

  freeform_tags = local.common_tags
}

resource "oci_core_route_table" "private" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.ai_vcn.id
  display_name   = "${var.project_name}-private-rt"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_nat_gateway.nat.id
  }

  route_rules {
    destination       = data.oci_core_services.all_services.services[0].cidr_block
    destination_type  = "SERVICE_CIDR_BLOCK"
    network_entity_id = oci_core_service_gateway.sgw.id
  }

  freeform_tags = local.common_tags
}

# Security Lists

# Public Security List (minimal - HTTPS only)
resource "oci_core_security_list" "public" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.ai_vcn.id
  display_name   = "${var.project_name}-public-sl"

  # Ingress: HTTPS from anywhere
  ingress_security_rules {
    protocol    = "6"  # TCP
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = false

    tcp_options {
      min = 443
      max = 443
    }
  }

  # Egress: To private subnets only
  egress_security_rules {
    protocol         = "6"  # TCP
    destination      = "10.0.10.0/24"
    destination_type = "CIDR_BLOCK"
    stateless        = false

    tcp_options {
      min = 8080
      max = 8080
    }
  }

  freeform_tags = local.common_tags
}

# Private App Security List
resource "oci_core_security_list" "private_app" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.ai_vcn.id
  display_name   = "${var.project_name}-private-app-sl"

  # Ingress: From public subnet (load balancer)
  ingress_security_rules {
    protocol    = "6"  # TCP
    source      = "10.0.1.0/24"
    source_type = "CIDR_BLOCK"
    stateless   = false

    tcp_options {
      min = 8080
      max = 8080
    }
  }

  # Egress: To data tier
  egress_security_rules {
    protocol         = "6"  # TCP
    destination      = "10.0.20.0/24"
    destination_type = "CIDR_BLOCK"
    stateless        = false
  }

  # Egress: To OCI services (for GenAI API)
  egress_security_rules {
    protocol         = "6"  # TCP
    destination      = data.oci_core_services.all_services.services[0].cidr_block
    destination_type = "SERVICE_CIDR_BLOCK"
    stateless        = false
  }

  # Egress: To internet via NAT (for external APIs)
  egress_security_rules {
    protocol         = "6"  # TCP
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    stateless        = false

    tcp_options {
      min = 443
      max = 443
    }
  }

  freeform_tags = local.common_tags
}

# Private Data Security List (most restrictive)
resource "oci_core_security_list" "private_data" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.ai_vcn.id
  display_name   = "${var.project_name}-private-data-sl"

  # Ingress: From app tier only
  ingress_security_rules {
    protocol    = "6"  # TCP
    source      = "10.0.10.0/24"
    source_type = "CIDR_BLOCK"
    stateless   = false
  }

  # Egress: To OCI services only
  egress_security_rules {
    protocol         = "6"  # TCP
    destination      = data.oci_core_services.all_services.services[0].cidr_block
    destination_type = "SERVICE_CIDR_BLOCK"
    stateless        = false
  }

  freeform_tags = local.common_tags
}

# IAM Policies for GenAI

# Policy for GenAI access
resource "oci_identity_policy" "genai_access" {
  compartment_id = var.tenancy_ocid
  name           = "${var.project_name}-genai-policy-${var.environment}"
  description    = "Policy for GenAI service access"

  statements = [
    # Allow specific group to use GenAI
    "Allow group ${var.genai_users_group} to use generative-ai-family in compartment id ${var.compartment_id}",

    # Allow functions to call GenAI
    "Allow dynamic-group ${oci_identity_dynamic_group.functions.name} to use generative-ai-family in compartment id ${var.compartment_id}",

    # Allow reading from object storage for RAG
    "Allow dynamic-group ${oci_identity_dynamic_group.functions.name} to read objects in compartment id ${var.compartment_id}",
  ]

  freeform_tags = local.common_tags
}

# Dynamic Group for Functions
resource "oci_identity_dynamic_group" "functions" {
  compartment_id = var.tenancy_ocid
  name           = "${var.project_name}-functions-dg-${var.environment}"
  description    = "Dynamic group for AI gateway functions"

  matching_rule = "ALL {resource.type = 'fnfunc', resource.compartment.id = '${var.compartment_id}'}"

  freeform_tags = local.common_tags
}

# Vault for Secrets
resource "oci_kms_vault" "ai_vault" {
  compartment_id = var.compartment_id
  display_name   = "${var.project_name}-vault-${var.environment}"
  vault_type     = "DEFAULT"

  freeform_tags = local.common_tags
}

# Master Encryption Key
resource "oci_kms_key" "ai_key" {
  compartment_id = var.compartment_id
  display_name   = "${var.project_name}-key-${var.environment}"

  key_shape {
    algorithm = "AES"
    length    = 32
  }

  management_endpoint = oci_kms_vault.ai_vault.management_endpoint

  protection_mode = "SOFTWARE"  # Use "HSM" for production

  freeform_tags = local.common_tags
}

# Cloud Guard (Security Monitoring)
resource "oci_cloud_guard_cloud_guard_configuration" "main" {
  compartment_id   = var.tenancy_ocid
  reporting_region = var.region
  status           = "ENABLED"
}

# Logging - VCN Flow Logs
resource "oci_logging_log_group" "security" {
  compartment_id = var.compartment_id
  display_name   = "${var.project_name}-security-logs"

  freeform_tags = local.common_tags
}

resource "oci_logging_log" "vcn_flow" {
  display_name = "${var.project_name}-vcn-flow-logs"
  log_group_id = oci_logging_log_group.security.id
  log_type     = "SERVICE"

  configuration {
    source {
      category    = "all"
      resource    = oci_core_subnet.private_app.id
      service     = "flowlogs"
      source_type = "OCISERVICE"
    }
  }

  is_enabled         = true
  retention_duration = 90

  freeform_tags = local.common_tags
}

# Data Sources
data "oci_core_services" "all_services" {
  filter {
    name   = "name"
    values = ["All .* Services In Oracle Services Network"]
    regex  = true
  }
}

# Variables
variable "genai_users_group" {
  description = "IAM group name for GenAI users"
  type        = string
  default     = "genai-users"
}

# Local values
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    Purpose     = "Security-Baseline"
  }
}

# Outputs
output "vcn_id" {
  description = "VCN OCID"
  value       = oci_core_vcn.ai_vcn.id
}

output "public_subnet_id" {
  description = "Public subnet OCID"
  value       = oci_core_subnet.public.id
}

output "private_app_subnet_id" {
  description = "Private app subnet OCID"
  value       = oci_core_subnet.private_app.id
}

output "private_data_subnet_id" {
  description = "Private data subnet OCID"
  value       = oci_core_subnet.private_data.id
}

output "vault_id" {
  description = "KMS Vault OCID"
  value       = oci_kms_vault.ai_vault.id
}

output "encryption_key_id" {
  description = "Master encryption key OCID"
  value       = oci_kms_key.ai_key.id
}

output "functions_dynamic_group" {
  description = "Dynamic group for functions"
  value       = oci_identity_dynamic_group.functions.name
}
