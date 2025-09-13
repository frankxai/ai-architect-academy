import os
import sys
import typer
from rich.console import Console
from dotenv import load_dotenv

# Ensure parent directory is on path for local imports when running as a script
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.swarms import Agent, AgentConfig, PlannerWorkerReviewerOrchestrator, Message

app = typer.Typer()
console = Console()


@app.command()
def main(goal: str = typer.Option(..., help="What should the swarm accomplish?")):
	load_dotenv()
	console.rule("Agentic Code Swarm — Hello Swarm")

	planner = Agent(
		config=AgentConfig(
			name="planner",
			system_prompt="""
You are the Planner. Read the user's goal and produce a short plan with 2-4 steps.
""".strip(),
		),
	)
	worker = Agent(
		config=AgentConfig(
			name="worker",
			system_prompt="""
You are the Worker. Execute the plan as code or a concrete artifact when possible.
""".strip(),
		),
	)
	reviewer = Agent(
		config=AgentConfig(
			name="reviewer",
			system_prompt="""
You are the Reviewer. Critique the work for correctness and provide a final concise answer.
""".strip(),
		),
	)

	orch = PlannerWorkerReviewerOrchestrator(agents={
		"planner": planner,
		"worker": worker,
		"reviewer": reviewer,
	})

	history = orch.run(goal=goal)
	for msg in history:
		role = msg.name or msg.role
		console.print(f"[bold cyan]{role}[/]:\n{msg.content}\n")


if __name__ == "__main__":
	app()

