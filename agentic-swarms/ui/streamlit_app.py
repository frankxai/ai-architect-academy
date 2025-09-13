import os
import sys
from dotenv import load_dotenv
import streamlit as st

# Ensure parent directory is on path for local imports when running as a script
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.swarms import Agent, AgentConfig, PlannerWorkerReviewerOrchestrator


def build_orchestrator():
	planner = Agent(
		config=AgentConfig(
			name="planner",
			system_prompt="Plan: 2-4 steps to achieve the user's goal."
		),
	)
	worker = Agent(
		config=AgentConfig(
			name="worker",
			system_prompt="Execute the plan. Prefer concrete code snippets when applicable."
		),
	)
	reviewer = Agent(
		config=AgentConfig(
			name="reviewer",
			system_prompt="Review for correctness. Provide concise final answer."
		),
	)
	return PlannerWorkerReviewerOrchestrator(agents={
		"planner": planner,
		"worker": worker,
		"reviewer": reviewer,
	})


def main():
	load_dotenv()
	st.set_page_config(page_title="Agentic Code Swarms", page_icon="🤖", layout="wide")
	st.title("Agentic Code Swarms — Visual Explorer")
	st.write("Learn multi-agent coordination via Planner → Worker → Reviewer.")

	with st.sidebar:
		st.header("Settings")
		model = st.text_input("Model (LiteLLM)", os.getenv("LITELLM_MODEL", "gpt-4o-mini"))
		temp = st.slider("Temperature", 0.0, 1.0, float(os.getenv("TEMPERATURE", 0.2)))
		st.caption("If no API keys are set, the app runs with a deterministic mock provider.")

	goal = st.text_input("Goal", "Create a function to add two numbers")
	if st.button("Run Swarm"):
		orch = build_orchestrator()
		# adjust configs based on sidebar
		for a in orch.agents.values():
			a.config.temperature = temp
			a.config.model = model

		hist = orch.run(goal=goal)
		for msg in hist:
			role = msg.name or msg.role
			with st.expander(role, expanded=True):
				st.markdown(msg.content)

	st.divider()
	st.subheader("How it works")
	st.markdown("""
The Explorer uses a minimal core to teach concepts:

- Roles: Planner, Worker, Reviewer
- Messages: shared history, handoffs
- Provider: mock (offline) or LiteLLM (real models)
- Controls: model, temperature

Extend this by adding tools and alternative orchestrations (round-robin, map-reduce, role assignment).
""")


if __name__ == "__main__":
	main()

