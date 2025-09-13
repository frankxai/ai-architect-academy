import os
import sys
import typer
from rich.console import Console
from dotenv import load_dotenv

# Ensure parent directory is on path for local imports when running as a script
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.swarms import Agent, AgentConfig, PlannerWorkerReviewerOrchestrator

app = typer.Typer()
console = Console()


@app.command()
def main(
	product: str = typer.Option(..., help="SaaS idea, e.g., 'AI interview coach for sales reps'"),
):
	load_dotenv()
	console.rule("Agentic Code Swarm — SaaS Planner")

	planner = Agent(
		config=AgentConfig(
			name="planner",
			system_prompt=(
				"You are a Product Planner. Produce a crisp plan with: target user, core jobs-to-be-done, key features, risks, and a 2-week MVP outline."
			),
		),
	)
	worker = Agent(
		config=AgentConfig(
			name="worker",
			system_prompt=(
				"You are a Tech Lead. Produce a technical architecture: components, data flow, APIs, models, eval plan, and a day-by-day build plan."
			),
		),
	)
	reviewer = Agent(
		config=AgentConfig(
			name="reviewer",
			system_prompt=(
				"You are a Product Reviewer. Check feasibility, risks, costs, and provide a concise, actionable executive summary."
			),
		),
	)

	orch = PlannerWorkerReviewerOrchestrator(agents={
		"planner": planner,
		"worker": worker,
		"reviewer": reviewer,
	})

	hist = orch.run(goal=f"Plan a SaaS: {product}")
	for msg in hist:
		role = msg.name or msg.role
		console.print(f"[bold cyan]{role}[/]:\n{msg.content}\n")


if __name__ == "__main__":
	app()

