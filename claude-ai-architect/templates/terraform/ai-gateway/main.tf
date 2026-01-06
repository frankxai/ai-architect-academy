# AI Gateway for Multi-Model Routing
# Terraform configuration for API Gateway + Functions-based AI routing

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
  description = "Compartment for AI Gateway resources"
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
  default     = "ai-gateway"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vcn_id" {
  description = "VCN OCID for the gateway"
  type        = string
}

variable "subnet_id" {
  description = "Subnet OCID for the gateway"
  type        = string
}

# API Gateway
resource "oci_apigateway_gateway" "ai_gateway" {
  compartment_id = var.compartment_id
  endpoint_type  = "PUBLIC"
  subnet_id      = var.subnet_id
  display_name   = "${var.project_name}-${var.environment}"

  response_cache_details {
    type = "EXTERNAL_RESP_CACHE"

    # Optional: External cache configuration
    # servers {
    #   host = var.redis_host
    #   port = 6379
    # }
  }

  freeform_tags = local.common_tags
}

# API Deployment for AI Routing
resource "oci_apigateway_deployment" "ai_routes" {
  compartment_id = var.compartment_id
  gateway_id     = oci_apigateway_gateway.ai_gateway.id
  path_prefix    = "/v1"
  display_name   = "${var.project_name}-routes-${var.environment}"

  specification {
    # Request Policies (applied to all routes)
    request_policies {
      authentication {
        type                        = "CUSTOM_AUTHENTICATION"
        function_id                 = oci_functions_function.auth.id
        is_anonymous_access_allowed = false
      }

      rate_limiting {
        rate_in_requests_per_second = var.rate_limit_per_second
        rate_key                    = "CLIENT_IP"
      }

      cors {
        allowed_origins = var.cors_origins
        allowed_methods = ["GET", "POST", "OPTIONS"]
        allowed_headers = ["*"]
        max_age_in_seconds = 3600
      }
    }

    # Logging Policy
    logging_policies {
      access_log {
        is_enabled = true
      }
      execution_log {
        is_enabled = true
        log_level  = "INFO"
      }
    }

    # Route: Chat Completion (routes to appropriate model)
    routes {
      path    = "/chat/completions"
      methods = ["POST"]

      backend {
        type        = "ORACLE_FUNCTIONS_BACKEND"
        function_id = oci_functions_function.router.id
      }

      request_policies {
        body_validation {
          content {
            media_type      = "application/json"
            validation_type = "NONE"
          }
          required        = true
          validation_mode = "ENFORCING"
        }
      }

      response_policies {
        response_cache_lookup {
          type                       = "SIMPLE_LOOKUP_POLICY"
          is_enabled                 = true
          is_private_caching_enabled = false
          cache_key_additions        = []
        }
      }
    }

    # Route: Embeddings
    routes {
      path    = "/embeddings"
      methods = ["POST"]

      backend {
        type        = "ORACLE_FUNCTIONS_BACKEND"
        function_id = oci_functions_function.embeddings.id
      }
    }

    # Route: Models List
    routes {
      path    = "/models"
      methods = ["GET"]

      backend {
        type = "STOCK_RESPONSE_BACKEND"
        body = jsonencode({
          object = "list"
          data = [
            {
              id       = "oci-command-r-plus"
              object   = "model"
              provider = "oci"
            },
            {
              id       = "oci-command-r"
              object   = "model"
              provider = "oci"
            },
            {
              id       = "oci-command-light"
              object   = "model"
              provider = "oci"
            },
            {
              id       = "azure-gpt-4-turbo"
              object   = "model"
              provider = "azure"
            }
          ]
        })
        status = 200
        headers {
          name  = "Content-Type"
          value = "application/json"
        }
      }
    }

    # Route: Health Check
    routes {
      path    = "/health"
      methods = ["GET"]

      backend {
        type   = "STOCK_RESPONSE_BACKEND"
        body   = jsonencode({ status = "healthy" })
        status = 200
        headers {
          name  = "Content-Type"
          value = "application/json"
        }
      }
    }
  }

  freeform_tags = local.common_tags

  depends_on = [
    oci_functions_function.router,
    oci_functions_function.auth,
    oci_functions_function.embeddings
  ]
}

# Functions Application
resource "oci_functions_application" "ai_gateway" {
  compartment_id = var.compartment_id
  display_name   = "${var.project_name}-app-${var.environment}"
  subnet_ids     = [var.subnet_id]

  config = {
    "OCI_GENAI_ENDPOINT"     = var.oci_genai_endpoint_id
    "AZURE_OPENAI_ENDPOINT"  = var.azure_openai_endpoint
    "AZURE_OPENAI_KEY"       = var.azure_openai_key  # Use secrets in production!
    "DEFAULT_MODEL"          = "oci-command-r-plus"
    "CACHE_TTL_SECONDS"      = "3600"
  }

  freeform_tags = local.common_tags
}

# Router Function (placeholder - deploy actual function separately)
resource "oci_functions_function" "router" {
  application_id = oci_functions_application.ai_gateway.id
  display_name   = "ai-router"
  image          = "${var.ocir_repo}/ai-router:${var.function_version}"
  memory_in_mbs  = 256
  timeout_in_seconds = 120

  freeform_tags = local.common_tags
}

# Auth Function
resource "oci_functions_function" "auth" {
  application_id = oci_functions_application.ai_gateway.id
  display_name   = "ai-auth"
  image          = "${var.ocir_repo}/ai-auth:${var.function_version}"
  memory_in_mbs  = 128
  timeout_in_seconds = 30

  freeform_tags = local.common_tags
}

# Embeddings Function
resource "oci_functions_function" "embeddings" {
  application_id = oci_functions_application.ai_gateway.id
  display_name   = "ai-embeddings"
  image          = "${var.ocir_repo}/ai-embeddings:${var.function_version}"
  memory_in_mbs  = 256
  timeout_in_seconds = 60

  freeform_tags = local.common_tags
}

# Variables for functions
variable "ocir_repo" {
  description = "OCIR repository for function images"
  type        = string
}

variable "function_version" {
  description = "Version tag for function images"
  type        = string
  default     = "latest"
}

variable "oci_genai_endpoint_id" {
  description = "OCI GenAI endpoint OCID"
  type        = string
  default     = ""
}

variable "azure_openai_endpoint" {
  description = "Azure OpenAI endpoint URL"
  type        = string
  default     = ""
}

variable "azure_openai_key" {
  description = "Azure OpenAI API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "rate_limit_per_second" {
  description = "Rate limit per second per client"
  type        = number
  default     = 10
}

variable "cors_origins" {
  description = "Allowed CORS origins"
  type        = list(string)
  default     = ["*"]
}

# Local values
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    Purpose     = "AI-Gateway"
  }
}

# Outputs
output "gateway_url" {
  description = "API Gateway URL"
  value       = oci_apigateway_gateway.ai_gateway.hostname
}

output "gateway_id" {
  description = "API Gateway OCID"
  value       = oci_apigateway_gateway.ai_gateway.id
}

output "chat_endpoint" {
  description = "Chat completion endpoint"
  value       = "https://${oci_apigateway_gateway.ai_gateway.hostname}/v1/chat/completions"
}

output "embeddings_endpoint" {
  description = "Embeddings endpoint"
  value       = "https://${oci_apigateway_gateway.ai_gateway.hostname}/v1/embeddings"
}
