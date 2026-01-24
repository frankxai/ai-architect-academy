"""
Multi-Cloud AI Gateway Architecture

Generates a diagram showing intelligent routing across
AWS Bedrock, Azure OpenAI, Google Vertex AI, and OCI GenAI.

Requirements:
    pip install diagrams
    brew install graphviz  # or apt install graphviz

Usage:
    python multi_cloud_gateway.py
    # Outputs: multi_cloud_ai_gateway.png
"""

from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.ml import Sagemaker
from diagrams.aws.network import APIGateway
from diagrams.azure.compute import FunctionApps
from diagrams.azure.ml import MachineLearningServiceWorkspaces
from diagrams.gcp.compute import Functions as GCPFunctions
from diagrams.gcp.ml import AIPlatform
from diagrams.onprem.client import Users
from diagrams.onprem.network import Nginx
from diagrams.generic.database import SQL
from diagrams.generic.network import Firewall

# Graph attributes for styling
graph_attr = {
    "fontsize": "20",
    "bgcolor": "white",
    "pad": "0.5",
    "splines": "spline",
}

node_attr = {
    "fontsize": "12",
}

with Diagram(
    "Multi-Cloud AI Gateway",
    show=False,
    direction="TB",
    filename="multi_cloud_ai_gateway",
    outformat="png",
    graph_attr=graph_attr,
    node_attr=node_attr,
):
    # Clients
    users = Users("Applications")

    # API Gateway Layer
    with Cluster("API Gateway Layer"):
        gateway = Nginx("AI Gateway\n(Intelligent Router)")
        firewall = Firewall("WAF + Rate Limit")

    # Routing & Caching
    with Cluster("Orchestration"):
        cache = SQL("Response Cache\n(Redis)")

    # AWS Cluster
    with Cluster("AWS"):
        aws_api = APIGateway("API Gateway")
        bedrock = Lambda("Bedrock\n(Claude, Llama)")
        sagemaker = Sagemaker("SageMaker\n(Custom Models)")

    # Azure Cluster
    with Cluster("Azure"):
        azure_func = FunctionApps("Function App")
        azure_openai = MachineLearningServiceWorkspaces("Azure OpenAI\n(GPT-4, GPT-4o)")

    # GCP Cluster
    with Cluster("Google Cloud"):
        gcp_func = GCPFunctions("Cloud Functions")
        vertex = AIPlatform("Vertex AI\n(Gemini)")

    # User flow
    users >> firewall >> gateway

    # Gateway to cache
    gateway >> Edge(label="Check Cache") >> cache

    # Gateway to providers
    gateway >> Edge(label="Claude/Llama", color="orange") >> aws_api
    gateway >> Edge(label="GPT-4", color="blue") >> azure_func
    gateway >> Edge(label="Gemini", color="green") >> gcp_func

    # Internal provider routing
    aws_api >> bedrock
    aws_api >> sagemaker
    azure_func >> azure_openai
    gcp_func >> vertex


if __name__ == "__main__":
    print("Generating multi_cloud_ai_gateway.png...")
    # Diagram is generated on import due to the with statement
    print("Done! Check multi_cloud_ai_gateway.png")
