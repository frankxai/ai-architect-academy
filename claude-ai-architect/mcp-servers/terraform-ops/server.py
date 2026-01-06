#!/usr/bin/env python3
"""
Terraform Operations MCP Server
================================

Model Context Protocol server for Terraform operations.
Enables Claude to run terraform plan, inspect state, and manage infrastructure.

Installation:
    pip install mcp

Requirements:
    - Terraform CLI installed and in PATH

Usage:
    python server.py

Add to Claude settings:
    {
      "mcpServers": {
        "terraform": {
          "command": "python",
          "args": ["/path/to/server.py"],
          "env": {
            "TF_WORKSPACE_DIR": "/path/to/terraform/projects"
          }
        }
      }
    }
"""

import asyncio
import json
import os
import subprocess
from pathlib import Path
from typing import Optional

try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Install with: pip install mcp")
    exit(1)


# Initialize server
server = Server("terraform-ops")

# Configuration
DEFAULT_WORKSPACE = os.environ.get("TF_WORKSPACE_DIR", os.getcwd())


def run_terraform(args: list, cwd: str, capture_json: bool = False) -> dict:
    """Run terraform command and return result."""
    cmd = ["terraform"] + args

    if capture_json and "-json" not in args:
        args.append("-json")
        cmd = ["terraform"] + args

    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )

        return {
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "return_code": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": "Command timed out after 5 minutes"
        }
    except FileNotFoundError:
        return {
            "success": False,
            "error": "Terraform CLI not found. Please install Terraform."
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def validate_workspace(workspace: str) -> tuple[bool, str]:
    """Validate terraform workspace exists and has .tf files."""
    path = Path(workspace)

    if not path.exists():
        return False, f"Directory does not exist: {workspace}"

    if not path.is_dir():
        return False, f"Not a directory: {workspace}"

    tf_files = list(path.glob("*.tf"))
    if not tf_files:
        return False, f"No .tf files found in: {workspace}"

    return True, "Valid workspace"


# ============================================================================
# Tools: Terraform Operations
# ============================================================================

@server.tool()
async def terraform_init(workspace: Optional[str] = None) -> str:
    """
    Initialize a Terraform workspace.

    Args:
        workspace: Path to terraform directory (default: TF_WORKSPACE_DIR)

    Returns:
        Initialization result
    """
    workspace = workspace or DEFAULT_WORKSPACE

    valid, msg = validate_workspace(workspace)
    if not valid:
        return json.dumps({"success": False, "error": msg})

    result = run_terraform(["init", "-no-color"], workspace)

    return json.dumps({
        "success": result["success"],
        "workspace": workspace,
        "output": result["stdout"] if result["success"] else result.get("stderr", result.get("error"))
    }, indent=2)


@server.tool()
async def terraform_plan(workspace: Optional[str] = None) -> str:
    """
    Run terraform plan and return summary of changes.

    Args:
        workspace: Path to terraform directory (default: TF_WORKSPACE_DIR)

    Returns:
        Plan summary with add/change/destroy counts
    """
    workspace = workspace or DEFAULT_WORKSPACE

    valid, msg = validate_workspace(workspace)
    if not valid:
        return json.dumps({"success": False, "error": msg})

    result = run_terraform(["plan", "-no-color", "-detailed-exitcode"], workspace)

    # Parse plan output for changes
    changes = {"add": 0, "change": 0, "destroy": 0}

    if result["stdout"]:
        lines = result["stdout"].split("\n")
        for line in lines:
            if "to add" in line.lower():
                # Parse "Plan: X to add, Y to change, Z to destroy"
                parts = line.split(",")
                for part in parts:
                    if "add" in part:
                        try:
                            changes["add"] = int(part.split()[0])
                        except (ValueError, IndexError):
                            pass
                    elif "change" in part:
                        try:
                            changes["change"] = int(part.split()[0])
                        except (ValueError, IndexError):
                            pass
                    elif "destroy" in part:
                        try:
                            changes["destroy"] = int(part.split()[0])
                        except (ValueError, IndexError):
                            pass

    # Exit code 2 means changes detected (not an error)
    success = result["return_code"] in [0, 2]

    return json.dumps({
        "success": success,
        "workspace": workspace,
        "changes": changes,
        "has_changes": result["return_code"] == 2,
        "plan_output": result["stdout"][-2000:] if result["stdout"] else None,  # Last 2000 chars
        "error": result.get("stderr") if not success else None
    }, indent=2)


@server.tool()
async def terraform_state_list(workspace: Optional[str] = None) -> str:
    """
    List resources in Terraform state.

    Args:
        workspace: Path to terraform directory (default: TF_WORKSPACE_DIR)

    Returns:
        List of resources in state
    """
    workspace = workspace or DEFAULT_WORKSPACE

    valid, msg = validate_workspace(workspace)
    if not valid:
        return json.dumps({"success": False, "error": msg})

    result = run_terraform(["state", "list"], workspace)

    resources = []
    if result["success"] and result["stdout"]:
        resources = [r.strip() for r in result["stdout"].strip().split("\n") if r.strip()]

    return json.dumps({
        "success": result["success"],
        "workspace": workspace,
        "resource_count": len(resources),
        "resources": resources
    }, indent=2)


@server.tool()
async def terraform_state_show(resource_address: str, workspace: Optional[str] = None) -> str:
    """
    Show details of a specific resource in state.

    Args:
        resource_address: Resource address (e.g., "oci_core_vcn.main")
        workspace: Path to terraform directory

    Returns:
        Resource details
    """
    workspace = workspace or DEFAULT_WORKSPACE

    valid, msg = validate_workspace(workspace)
    if not valid:
        return json.dumps({"success": False, "error": msg})

    result = run_terraform(["state", "show", resource_address], workspace)

    return json.dumps({
        "success": result["success"],
        "resource": resource_address,
        "details": result["stdout"] if result["success"] else None,
        "error": result.get("stderr") if not result["success"] else None
    }, indent=2)


@server.tool()
async def terraform_output(workspace: Optional[str] = None) -> str:
    """
    Get Terraform outputs.

    Args:
        workspace: Path to terraform directory

    Returns:
        JSON with all outputs
    """
    workspace = workspace or DEFAULT_WORKSPACE

    valid, msg = validate_workspace(workspace)
    if not valid:
        return json.dumps({"success": False, "error": msg})

    result = run_terraform(["output", "-json"], workspace)

    outputs = {}
    if result["success"] and result["stdout"]:
        try:
            outputs = json.loads(result["stdout"])
        except json.JSONDecodeError:
            pass

    return json.dumps({
        "success": result["success"],
        "workspace": workspace,
        "outputs": outputs
    }, indent=2)


@server.tool()
async def terraform_validate(workspace: Optional[str] = None) -> str:
    """
    Validate Terraform configuration.

    Args:
        workspace: Path to terraform directory

    Returns:
        Validation result
    """
    workspace = workspace or DEFAULT_WORKSPACE

    valid, msg = validate_workspace(workspace)
    if not valid:
        return json.dumps({"success": False, "error": msg})

    result = run_terraform(["validate", "-json"], workspace)

    validation = {}
    if result["stdout"]:
        try:
            validation = json.loads(result["stdout"])
        except json.JSONDecodeError:
            validation = {"raw": result["stdout"]}

    return json.dumps({
        "success": result["success"],
        "workspace": workspace,
        "valid": validation.get("valid", result["success"]),
        "error_count": validation.get("error_count", 0),
        "warning_count": validation.get("warning_count", 0),
        "diagnostics": validation.get("diagnostics", [])
    }, indent=2)


@server.tool()
async def terraform_fmt_check(workspace: Optional[str] = None) -> str:
    """
    Check if Terraform files are properly formatted.

    Args:
        workspace: Path to terraform directory

    Returns:
        List of unformatted files
    """
    workspace = workspace or DEFAULT_WORKSPACE

    valid, msg = validate_workspace(workspace)
    if not valid:
        return json.dumps({"success": False, "error": msg})

    result = run_terraform(["fmt", "-check", "-recursive", "-diff"], workspace)

    unformatted = []
    if result["stdout"]:
        unformatted = [f.strip() for f in result["stdout"].strip().split("\n") if f.strip()]

    return json.dumps({
        "success": result["return_code"] == 0,
        "workspace": workspace,
        "formatted": result["return_code"] == 0,
        "unformatted_files": unformatted
    }, indent=2)


@server.tool()
async def list_workspaces(base_dir: Optional[str] = None) -> str:
    """
    List available Terraform workspaces/projects.

    Args:
        base_dir: Base directory to search (default: TF_WORKSPACE_DIR)

    Returns:
        List of directories containing .tf files
    """
    base_dir = base_dir or DEFAULT_WORKSPACE
    base_path = Path(base_dir)

    if not base_path.exists():
        return json.dumps({"success": False, "error": f"Directory not found: {base_dir}"})

    workspaces = []

    # Check base directory
    if list(base_path.glob("*.tf")):
        workspaces.append({
            "path": str(base_path),
            "name": base_path.name,
            "tf_files": len(list(base_path.glob("*.tf")))
        })

    # Check subdirectories
    for subdir in base_path.iterdir():
        if subdir.is_dir():
            tf_files = list(subdir.glob("*.tf"))
            if tf_files:
                workspaces.append({
                    "path": str(subdir),
                    "name": subdir.name,
                    "tf_files": len(tf_files)
                })

    return json.dumps({
        "success": True,
        "base_dir": str(base_dir),
        "workspace_count": len(workspaces),
        "workspaces": workspaces
    }, indent=2)


# ============================================================================
# Resources
# ============================================================================

@server.resource("terraform://version")
async def get_terraform_version() -> str:
    """Get Terraform version information."""
    result = run_terraform(["version", "-json"], os.getcwd())

    if result["success"] and result["stdout"]:
        try:
            return result["stdout"]
        except Exception:
            pass

    return json.dumps({"error": "Could not get Terraform version"})


@server.resource("terraform://providers")
async def get_common_providers() -> str:
    """Get list of common Terraform providers."""
    return json.dumps({
        "providers": [
            {
                "name": "oci",
                "source": "oracle/oci",
                "docs": "https://registry.terraform.io/providers/oracle/oci/latest/docs"
            },
            {
                "name": "aws",
                "source": "hashicorp/aws",
                "docs": "https://registry.terraform.io/providers/hashicorp/aws/latest/docs"
            },
            {
                "name": "azurerm",
                "source": "hashicorp/azurerm",
                "docs": "https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs"
            },
            {
                "name": "google",
                "source": "hashicorp/google",
                "docs": "https://registry.terraform.io/providers/hashicorp/google/latest/docs"
            }
        ]
    }, indent=2)


# ============================================================================
# Main
# ============================================================================

async def main():
    """Run the MCP server."""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream)


if __name__ == "__main__":
    asyncio.run(main())
