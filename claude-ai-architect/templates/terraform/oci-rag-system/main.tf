# OCI RAG System with GenAI Agents
# Terraform configuration for complete RAG deployment

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
  description = "Compartment for RAG resources"
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
  default     = "rag-system"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Object Storage for Documents
resource "oci_objectstorage_bucket" "documents" {
  compartment_id = var.compartment_id
  namespace      = data.oci_objectstorage_namespace.ns.namespace
  name           = "${var.project_name}-documents-${var.environment}"
  access_type    = "NoPublicAccess"

  versioning = "Enabled"

  freeform_tags = local.common_tags
}

# Knowledge Base
resource "oci_generative_ai_agent_knowledge_base" "main" {
  compartment_id = var.compartment_id
  display_name   = "${var.project_name}-kb-${var.environment}"
  description    = "Knowledge base for ${var.project_name} RAG system"

  index_config {
    index_config_type = "DEFAULT_INDEX_CONFIG"

    # Optional: Custom index settings
    # should_enable_hybrid_search = true
  }

  freeform_tags = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

# Data Source - Connect Object Storage to Knowledge Base
resource "oci_generative_ai_agent_data_source" "documents" {
  compartment_id    = var.compartment_id
  knowledge_base_id = oci_generative_ai_agent_knowledge_base.main.id
  display_name      = "${var.project_name}-docs-source"

  data_source_config {
    data_source_config_type = "OCI_OBJECT_STORAGE"

    object_storage_prefixes {
      namespace   = data.oci_objectstorage_namespace.ns.namespace
      bucket_name = oci_objectstorage_bucket.documents.name
      prefix      = ""  # All objects in bucket
    }
  }

  freeform_tags = local.common_tags

  depends_on = [oci_generative_ai_agent_knowledge_base.main]
}

# GenAI Agent
resource "oci_generative_ai_agent_agent" "rag_agent" {
  compartment_id = var.compartment_id
  display_name   = "${var.project_name}-agent-${var.environment}"
  description    = "RAG-enabled agent for ${var.project_name}"

  knowledge_base_ids = [
    oci_generative_ai_agent_knowledge_base.main.id
  ]

  welcome_message = var.welcome_message

  system_message = var.system_message

  freeform_tags = local.common_tags

  depends_on = [
    oci_generative_ai_agent_knowledge_base.main,
    oci_generative_ai_agent_data_source.documents
  ]
}

# Agent Endpoint
resource "oci_generative_ai_agent_agent_endpoint" "main" {
  compartment_id = var.compartment_id
  agent_id       = oci_generative_ai_agent_agent.rag_agent.id
  display_name   = "${var.project_name}-endpoint-${var.environment}"
  description    = "Endpoint for ${var.project_name} RAG agent"

  content_moderation_config {
    should_enable_on_input  = var.enable_content_moderation
    should_enable_on_output = var.enable_content_moderation
  }

  freeform_tags = local.common_tags

  depends_on = [oci_generative_ai_agent_agent.rag_agent]
}

# Data sources
data "oci_objectstorage_namespace" "ns" {
  compartment_id = var.tenancy_ocid
}

# Variables for agent configuration
variable "welcome_message" {
  description = "Welcome message for the agent"
  type        = string
  default     = "Hello! I'm your AI assistant. How can I help you today?"
}

variable "system_message" {
  description = "System message/instructions for the agent"
  type        = string
  default     = <<-EOT
    You are a helpful assistant that answers questions based on the provided documents.
    Always cite your sources when possible.
    If you don't know the answer, say so clearly - don't make up information.
    Be concise but thorough in your responses.
  EOT
}

variable "enable_content_moderation" {
  description = "Enable content moderation on input/output"
  type        = bool
  default     = true
}

# Local values
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    Purpose     = "RAG-System"
  }
}

# Outputs
output "knowledge_base_id" {
  description = "Knowledge Base OCID"
  value       = oci_generative_ai_agent_knowledge_base.main.id
}

output "agent_id" {
  description = "Agent OCID"
  value       = oci_generative_ai_agent_agent.rag_agent.id
}

output "agent_endpoint_id" {
  description = "Agent Endpoint OCID"
  value       = oci_generative_ai_agent_agent_endpoint.main.id
}

output "documents_bucket" {
  description = "Object Storage bucket for documents"
  value       = oci_objectstorage_bucket.documents.name
}

output "namespace" {
  description = "Object Storage namespace"
  value       = data.oci_objectstorage_namespace.ns.namespace
}
