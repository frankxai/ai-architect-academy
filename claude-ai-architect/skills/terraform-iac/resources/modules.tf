# Terraform AI Infrastructure Modules
# Reference from SKILL.md for multi-cloud deployments

# ============================================================
# AWS BEDROCK MODULE
# ============================================================

# modules/aws-bedrock/main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_iam_role" "bedrock" {
  name = "${var.prefix}-bedrock-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "bedrock" {
  name = "${var.prefix}-bedrock-policy"
  role = aws_iam_role.bedrock.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Resource = var.allowed_model_arns
      }
    ]
  })
}

resource "aws_vpc_endpoint" "bedrock" {
  count = var.enable_private_endpoint ? 1 : 0

  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${var.region}.bedrock-runtime"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = var.private_subnet_ids
  security_group_ids  = [aws_security_group.bedrock[0].id]
  private_dns_enabled = true
}

resource "aws_bedrockagent_knowledge_base" "main" {
  count = var.create_knowledge_base ? 1 : 0

  name        = "${var.prefix}-knowledge-base"
  description = var.knowledge_base_description
  role_arn    = aws_iam_role.bedrock_kb[0].arn

  knowledge_base_configuration {
    type = "VECTOR"
    vector_knowledge_base_configuration {
      embedding_model_arn = "arn:aws:bedrock:${var.region}::foundation-model/amazon.titan-embed-text-v2:0"
    }
  }

  storage_configuration {
    type = "OPENSEARCH_SERVERLESS"
    opensearch_serverless_configuration {
      collection_arn    = var.opensearch_collection_arn
      vector_index_name = var.vector_index_name
      field_mapping {
        vector_field   = "embedding"
        text_field     = "text"
        metadata_field = "metadata"
      }
    }
  }
}

# ============================================================
# AZURE OPENAI MODULE
# ============================================================

# modules/azure-openai/main.tf

resource "azurerm_cognitive_account" "openai" {
  name                  = var.openai_name
  location              = var.location
  resource_group_name   = var.resource_group_name
  kind                  = "OpenAI"
  sku_name              = "S0"
  custom_subdomain_name = var.openai_name

  public_network_access_enabled = var.public_network_access

  network_acls {
    default_action = var.public_network_access ? "Allow" : "Deny"

    dynamic "virtual_network_rules" {
      for_each = var.allowed_subnet_ids
      content {
        subnet_id = virtual_network_rules.value
      }
    }
  }

  identity {
    type = "SystemAssigned"
  }

  tags = var.tags
}

resource "azurerm_cognitive_deployment" "gpt4o" {
  name                 = "gpt-4o"
  cognitive_account_id = azurerm_cognitive_account.openai.id

  model {
    format  = "OpenAI"
    name    = "gpt-4o"
    version = "2024-05-13"
  }

  sku {
    name     = var.gpt4o_sku_name
    capacity = var.gpt4o_capacity
  }
}

resource "azurerm_cognitive_deployment" "embedding" {
  name                 = "text-embedding-3-large"
  cognitive_account_id = azurerm_cognitive_account.openai.id

  model {
    format  = "OpenAI"
    name    = "text-embedding-3-large"
    version = "1"
  }

  sku {
    name     = "Standard"
    capacity = var.embedding_capacity
  }
}

resource "azurerm_private_endpoint" "openai" {
  count = var.enable_private_endpoint ? 1 : 0

  name                = "${var.openai_name}-pe"
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.private_endpoint_subnet_id

  private_service_connection {
    name                           = "${var.openai_name}-psc"
    private_connection_resource_id = azurerm_cognitive_account.openai.id
    subresource_names              = ["account"]
    is_manual_connection           = false
  }
}

resource "azurerm_search_service" "main" {
  count = var.create_search_service ? 1 : 0

  name                = "${var.openai_name}-search"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = var.search_sku
  replica_count       = var.search_replica_count
  partition_count     = var.search_partition_count
  semantic_search_sku = "standard"
}

# ============================================================
# OCI GENAI MODULE
# ============================================================

# modules/oci-genai/main.tf

resource "oci_generative_ai_dedicated_ai_cluster" "main" {
  compartment_id = var.compartment_id
  display_name   = "${var.prefix}-genai-cluster"
  type           = var.cluster_type
  unit_count     = var.unit_count
  unit_shape     = var.unit_shape

  freeform_tags = var.tags
}

resource "oci_generative_ai_endpoint" "main" {
  compartment_id             = var.compartment_id
  dedicated_ai_cluster_id    = oci_generative_ai_dedicated_ai_cluster.main.id
  display_name               = "${var.prefix}-endpoint"
  model_id                   = var.model_id

  content_moderation_config {
    is_enabled = var.enable_content_moderation
  }
}

resource "oci_generative_ai_agent" "main" {
  count = var.create_agent ? 1 : 0

  compartment_id = var.compartment_id
  display_name   = "${var.prefix}-agent"
  description    = var.agent_description

  knowledge_base_ids = var.knowledge_base_ids
}

resource "oci_generative_ai_agent_knowledge_base" "main" {
  count = var.create_knowledge_base ? 1 : 0

  compartment_id = var.compartment_id
  display_name   = "${var.prefix}-kb"

  index_config {
    index_config_type = "OCI_OPEN_SEARCH"

    indexes {
      name = var.opensearch_index_name
      schema {
        body_key           = "body"
        embedding_body_key = "embedding"
        title_key          = "title"
        url_key            = "url"
      }
    }

    cluster_id = var.opensearch_cluster_id
    secret_detail {
      type      = "BASIC"
      secret_id = var.opensearch_secret_id
    }
  }
}

# ============================================================
# VECTOR STORE - AWS OPENSEARCH SERVERLESS
# ============================================================

resource "aws_opensearchserverless_collection" "vectors" {
  name        = "${var.prefix}-vectors"
  type        = "VECTORSEARCH"
  description = "Vector store for AI embeddings"
}

resource "aws_opensearchserverless_security_policy" "encryption" {
  name = "${var.prefix}-encryption"
  type = "encryption"

  policy = jsonencode({
    Rules = [{
      ResourceType = "collection"
      Resource     = ["collection/${var.prefix}-vectors"]
    }]
    AWSOwnedKey = true
  })
}

resource "aws_opensearchserverless_access_policy" "data" {
  name = "${var.prefix}-data-access"
  type = "data"

  policy = jsonencode([{
    Rules = [
      {
        ResourceType = "index"
        Resource     = ["index/${var.prefix}-vectors/*"]
        Permission   = ["aoss:*"]
      },
      {
        ResourceType = "collection"
        Resource     = ["collection/${var.prefix}-vectors"]
        Permission   = ["aoss:*"]
      }
    ]
    Principal = var.allowed_principals
  }])
}

# ============================================================
# MANAGED KUBERNETES GPU - EKS
# ============================================================

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "ai-platform"
  cluster_version = "1.29"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    gpu = {
      instance_types = ["g5.2xlarge"]
      capacity_type  = "ON_DEMAND"

      min_size     = 1
      max_size     = 10
      desired_size = 2

      ami_type = "AL2_x86_64_GPU"

      labels = {
        "node-type" = "gpu"
      }

      taints = [{
        key    = "nvidia.com/gpu"
        value  = "true"
        effect = "NO_SCHEDULE"
      }]
    }
  }
}

# ============================================================
# MANAGED KUBERNETES GPU - AKS
# ============================================================

resource "azurerm_kubernetes_cluster_node_pool" "gpu" {
  name                  = "gpu"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.main.id
  vm_size               = "Standard_NC24ads_A100_v4"
  node_count            = 2

  node_labels = {
    "node-type" = "gpu"
  }

  node_taints = [
    "nvidia.com/gpu=true:NoSchedule"
  ]
}

# ============================================================
# MANAGED KUBERNETES GPU - OKE
# ============================================================

resource "oci_containerengine_node_pool" "gpu" {
  cluster_id     = oci_containerengine_cluster.main.id
  compartment_id = var.compartment_id
  name           = "gpu-pool"

  node_config_details {
    size = 2
    placement_configs {
      availability_domain = data.oci_identity_availability_domain.ad.name
      subnet_id           = oci_core_subnet.private.id
    }
  }

  node_shape = "BM.GPU.A100-v2.8"

  node_source_details {
    source_type = "IMAGE"
    image_id    = data.oci_core_images.gpu.images[0].id
  }
}
