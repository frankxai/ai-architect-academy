# OCI GPU & AI Infrastructure Deep Dive

## OCI AI Infrastructure Overview

Oracle Cloud Infrastructure provides enterprise-grade GPU infrastructure for AI/ML workloads, from development to Zettascale training clusters.

```
┌─────────────────────────────────────────────────────────────────┐
│                 OCI AI INFRASTRUCTURE STACK                      │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  ZETTASCALE10 (800K GPUs)                  │  │
│  │            Multi-datacenter AI Supercomputer               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   SUPERCLUSTERS                            │  │
│  │          Up to 131,072 NVIDIA Blackwell GPUs               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  GPU CLUSTERS                              │  │
│  │           RDMA networking, bare metal                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              INDIVIDUAL GPU INSTANCES                      │  │
│  │         A10, A100, H100, B200, MI300X                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Zettascale10: The Flagship

### What is Zettascale10?
OCI's largest AI supercomputer announced October 2025 - the foundation for OpenAI's Stargate project.

**Key Specifications:**
- **Peak Performance**: 16 zettaFLOPS (16 × 10²¹ FLOPS)
- **GPU Count**: Up to 800,000 NVIDIA GPUs
- **Architecture**: Multi-datacenter spanning
- **Networking**: Oracle Acceleron RoCEv2 ultra-low-latency
- **Power**: Multi-gigawatt deployment

```
ZETTASCALE10 ARCHITECTURE
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Datacenter 1          Datacenter 2          Datacenter N      │
│   ┌────────────┐        ┌────────────┐        ┌────────────┐   │
│   │ 100K GPUs  │◀──────▶│ 100K GPUs  │◀──────▶│ 100K GPUs  │   │
│   │            │        │            │        │            │   │
│   │ Acceleron  │        │ Acceleron  │        │ Acceleron  │   │
│   │  RoCE Net  │        │  RoCE Net  │        │  RoCE Net  │   │
│   └────────────┘        └────────────┘        └────────────┘   │
│         │                     │                     │           │
│         └─────────────────────┼─────────────────────┘           │
│                               │                                  │
│              Oracle Acceleron High-Speed Fabric                 │
│              (Cross-datacenter RDMA networking)                 │
│                                                                  │
│   Use Cases:                                                    │
│   ├── Foundation model pre-training                             │
│   ├── Multi-trillion parameter models                           │
│   └── Massive scale inference                                   │
└─────────────────────────────────────────────────────────────────┘
```

## OCI Superclusters

### Architecture
Up to 131,072 NVIDIA Blackwell B200 GPUs in NVIDIA Grace Blackwell GB200 Superchips.

**Key Features:**
- RDMA cluster networking (2.5μs latency)
- 220% better GPU VM pricing than competitors
- Bare metal instances for maximum performance
- InfiniBand and RoCE networking options

```
SUPERCLUSTER TOPOLOGY
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Spine Layer (High-bandwidth switching)                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    RDMA Fabric                           │   │
│   │              (InfiniBand / RoCEv2)                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│         │         │         │         │         │               │
│   ┌─────▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐         │
│   │ Leaf 1  │ │Leaf 2 │ │Leaf 3 │ │Leaf 4 │ │Leaf N │         │
│   └────┬────┘ └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘         │
│        │          │         │         │         │              │
│   ┌────▼────┐┌────▼────┐┌───▼────┐┌───▼────┐┌───▼────┐        │
│   │GPU Node ││GPU Node ││GPU Node││GPU Node││GPU Node│        │
│   │8x H100  ││8x H100  ││8x H100 ││8x H100 ││8x H100 │        │
│   │or B200  ││or B200  ││or B200 ││or B200 ││or B200 │        │
│   └─────────┘└─────────┘└────────┘└────────┘└────────┘        │
│                                                                  │
│   Each GPU Node:                                                │
│   ├── 8 GPUs (NVLink connected)                                 │
│   ├── Bare metal (no hypervisor overhead)                       │
│   ├── RDMA NIC (direct GPU-to-GPU communication)                │
│   └── Local NVMe storage (fast checkpointing)                   │
└─────────────────────────────────────────────────────────────────┘
```

## GPU Instance Types

### NVIDIA GPU Offerings

| Shape | GPUs | GPU Memory | Use Case |
|-------|------|------------|----------|
| BM.GPU.A10.4 | 4x A10 | 96 GB | Inference, small training |
| BM.GPU.A100-v2.8 | 8x A100 | 640 GB | Training, large models |
| BM.GPU.H100.8 | 8x H100 | 640 GB | LLM training, high throughput |
| BM.GPU.B200.8 | 8x B200 | 1.4 TB | Largest models, cutting edge |
| VM.GPU.A10.1 | 1x A10 | 24 GB | Development, testing |
| VM.GPU.A10.2 | 2x A10 | 48 GB | Medium inference |

### AMD GPU Offerings
| Shape | GPUs | GPU Memory | Use Case |
|-------|------|------------|----------|
| BM.GPU.MI300X.8 | 8x MI300X | 1.5 TB | HPC, AI training |

### Pricing Advantage
OCI offers up to **220% better pricing** on GPU VMs compared to other cloud providers.

```
COST COMPARISON (Representative)
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  8x A100 Instance (per hour):                                   │
│  ├── AWS: ~$32/hour                                             │
│  ├── Azure: ~$27/hour                                           │
│  └── OCI: ~$18/hour (BM.GPU.A100-v2.8)                         │
│                                                                  │
│  Monthly Savings (720 hours):                                   │
│  └── OCI vs AWS: ~$10,000/month per cluster                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Networking for AI

### RDMA Cluster Networking
Remote Direct Memory Access enables GPU-to-GPU communication without CPU overhead.

```
TRADITIONAL NETWORKING
GPU A ──▶ CPU ──▶ NIC ──▶ Switch ──▶ NIC ──▶ CPU ──▶ GPU B
         (Copy)        (Packet)        (Copy)
         High latency, CPU overhead

RDMA NETWORKING
GPU A ──▶ NIC ──▶ Switch ──▶ NIC ──▶ GPU B
         (Zero-copy, hardware offload)
         2.5 microsecond latency
```

**OCI RDMA Specifications:**
- Latency: As low as 2.5 microseconds
- Bandwidth: 100 Gbps per connection
- Scale: Thousands of GPUs in single cluster

### Network Topologies

**Fat-Tree (Clos) Network:**
```
Best for: General-purpose ML training

                 Core Switches
                 ┌─────────────┐
                 │   ┌───┬───┐ │
                 │   │   │   │ │
            ┌────┴───┴───┴───┴─┴────┐
            │         │         │
       Spine│    Spine│    Spine│
            │         │         │
       ┌────┴────┐┌───┴───┐┌───┴────┐
       │         ││       ││        │
    Leaf│     Leaf│    Leaf│     Leaf
       │         ││       ││        │
    ┌──┴──┐   ┌──┴──┐ ┌──┴──┐ ┌──┴──┐
    │GPU  │   │GPU  │ │GPU  │ │GPU  │
    │Nodes│   │Nodes│ │Nodes│ │Nodes│
    └─────┘   └─────┘ └─────┘ └─────┘
```

**Rail-Optimized Network:**
```
Best for: Collective operations (all-reduce)

GPU 0 ◀─────────────────────────────▶ GPU 0 (Node 2)
GPU 1 ◀─────────────────────────────▶ GPU 1 (Node 2)
GPU 2 ◀─────────────────────────────▶ GPU 2 (Node 2)
...
GPU 7 ◀─────────────────────────────▶ GPU 7 (Node 2)

Each GPU connects to dedicated network rail
Optimized for parallel collective communication
```

## High-Availability AI Architecture

### Design Principles
1. **No single point of failure**
2. **Fast failover** (< 60 seconds)
3. **Checkpointing** for training resilience
4. **Multi-zone deployment**

```
HIGH-AVAILABILITY AI DEPLOYMENT
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Availability Domain 1        Availability Domain 2             │
│  ┌─────────────────────┐      ┌─────────────────────┐          │
│  │ GPU Cluster A       │      │ GPU Cluster B       │          │
│  │ (Active)            │      │ (Standby/Active)    │          │
│  │                     │      │                     │          │
│  │ Training Job 1      │      │ Training Job 2      │          │
│  │ Inference Endpoint  │      │ Inference Endpoint  │          │
│  └──────────┬──────────┘      └──────────┬──────────┘          │
│             │                            │                      │
│             └────────────┬───────────────┘                      │
│                          │                                       │
│               ┌──────────▼──────────┐                           │
│               │   Load Balancer     │                           │
│               │   (Health checks)   │                           │
│               └──────────┬──────────┘                           │
│                          │                                       │
│               ┌──────────▼──────────┐                           │
│               │  Object Storage     │                           │
│               │  (Checkpoints,      │                           │
│               │   Model artifacts)  │                           │
│               └─────────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

### Checkpointing Strategy
```python
# Distributed training with checkpointing
import torch.distributed.checkpoint as dcp

def train_with_checkpointing(model, optimizer, data_loader):
    checkpoint_dir = "oci://bucket/checkpoints"
    checkpoint_interval = 1000  # steps

    for step, batch in enumerate(data_loader):
        loss = train_step(model, batch)

        if step % checkpoint_interval == 0:
            # Save distributed checkpoint
            dcp.save(
                state_dict={
                    "model": model.state_dict(),
                    "optimizer": optimizer.state_dict(),
                    "step": step
                },
                storage_writer=dcp.FileSystemWriter(checkpoint_dir)
            )

    # Fast recovery on failure
    # Resume from latest checkpoint automatically
```

## Deployment Options

### 1. OCI Public Cloud
Standard multi-tenant cloud with GPU instances.

**Best For:** Development, variable workloads, getting started

### 2. Dedicated Region
Full OCI region deployed in your data center.

```
YOUR DATA CENTER
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              OCI DEDICATED REGION                        │   │
│   │                                                          │   │
│   │   Same services as public OCI:                          │   │
│   │   ├── GPU instances (A100, H100)                        │   │
│   │   ├── GenAI Dedicated Clusters                          │   │
│   │   ├── Object Storage                                    │   │
│   │   ├── Autonomous Database                               │   │
│   │   └── All OCI services                                  │   │
│   │                                                          │   │
│   │   Benefits:                                             │   │
│   │   ├── Complete data sovereignty                         │   │
│   │   ├── Physical control                                  │   │
│   │   ├── Custom compliance                                 │   │
│   │   └── Lowest latency to on-prem                        │   │
│   │                                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Best For:** Regulated industries, data sovereignty, hybrid architectures

### 3. Sovereign Cloud
Government and regulated industry specific regions.

**Best For:** Government, defense, critical infrastructure

### 4. Roving Edge Infrastructure
AI at the edge with portable OCI nodes.

**Best For:** Remote locations, disconnected operations

## Terraform Deployment

### GPU Cluster Setup
```hcl
# GPU Instance Pool for Training
resource "oci_core_instance_pool" "gpu_cluster" {
  compartment_id            = var.compartment_id
  instance_configuration_id = oci_core_instance_configuration.gpu_config.id
  size                      = 8  # 8 nodes x 8 GPUs = 64 GPUs

  placement_configurations {
    availability_domain = data.oci_identity_availability_domain.ad1.name
    primary_subnet_id   = oci_core_subnet.gpu_subnet.id
  }
}

# GPU Instance Configuration
resource "oci_core_instance_configuration" "gpu_config" {
  compartment_id = var.compartment_id
  display_name   = "GPU-Training-Config"

  instance_details {
    instance_type = "compute"

    launch_details {
      compartment_id = var.compartment_id
      shape          = "BM.GPU.H100.8"

      shape_config {
        ocpus         = 112
        memory_in_gbs = 2048
      }

      source_details {
        source_type = "image"
        image_id    = data.oci_core_images.gpu_image.images[0].id
      }

      create_vnic_details {
        subnet_id        = oci_core_subnet.gpu_subnet.id
        assign_public_ip = false
      }
    }
  }
}

# RDMA Cluster Network
resource "oci_core_cluster_network" "gpu_rdma" {
  compartment_id = var.compartment_id
  display_name   = "GPU-RDMA-Cluster"

  instance_pools {
    id = oci_core_instance_pool.gpu_cluster.id
  }

  cluster_configuration {
    network_block_ids = [oci_core_network_block.rdma_block.id]
  }
}
```

### Autoscaling for Inference
```hcl
resource "oci_autoscaling_auto_scaling_configuration" "gpu_autoscale" {
  compartment_id       = var.compartment_id
  cool_down_in_seconds = 300
  display_name         = "GPU-Inference-Autoscaling"
  is_enabled           = true

  auto_scaling_resources {
    id   = oci_core_instance_pool.inference_pool.id
    type = "instancePool"
  }

  policies {
    capacity {
      initial = 2
      max     = 10
      min     = 2
    }

    policy_type = "threshold"

    rules {
      action {
        type  = "CHANGE_COUNT_BY"
        value = 2
      }

      metric {
        metric_type = "GPU_UTILIZATION"
        threshold {
          operator = "GT"
          value    = 80
        }
      }
    }
  }
}
```

## Best Practices

### 1. Right-Size GPU Selection
```
Task                          Recommended GPU
─────────────────────────────────────────────
Development/Testing           A10 (1-2 GPUs)
Small model fine-tuning       A100 (2-8 GPUs)
Large model training          H100 (8+ GPUs)
Production inference          A10 or A100
Maximum scale training        B200 clusters
```

### 2. Storage for AI Workloads
```
Data Type           Storage              Why
───────────────────────────────────────────────
Training data       Object Storage       Unlimited scale, low cost
Checkpoints         Object Storage       Durability, cross-region
Working data        Block Storage        High IOPS, NVMe
Shared models       File Storage         NFS access from cluster
```

### 3. Networking Optimization
- Use RDMA for multi-node training
- Place all GPUs in same availability domain for lowest latency
- Enable jumbo frames (MTU 9000) for data transfer
- Use private endpoints for Object Storage access

## Resources

- [OCI GPU Overview](https://www.oracle.com/cloud/compute/gpu/)
- [OCI Zettascale10 Announcement](https://www.oracle.com/news/announcement/ai-world-oracle-unveils-next-generation-oci-zettascale10-cluster-for-ai-2025-10-14/)
- [Deploy GPU Cluster Guide](https://docs.oracle.com/en/solutions/deploy-bare-metal-gpu-cluster-for-ai/)
- [NVIDIA on OCI](https://www.nvidia.com/en-us/data-center/gpu-cloud-computing/oracle-cloud-infrastructure/)
- [High-Availability AI Apps](https://blogs.oracle.com/ai-and-datascience/designing-high-availability-ai-apps-gpus-infrastructure)
