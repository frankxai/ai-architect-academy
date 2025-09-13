AI Architect Academy — Agentic Code Swarms Module

Learn, build, and visualize multi‑agent systems step by step. This module includes:

- A minimal, clear Python core for agents, tools, and orchestration
- Runnable examples (Hello Swarm, SaaS Planner)
- A Streamlit UI for visual exploration and teaching
- Notebooks for hands‑on labs

Quickstart

1) Install

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

2) Run Hello Swarm (offline friendly)

```bash
python examples/hello_swarm.py --goal "Create a tiny function to add two numbers"
```

3) Launch the visual UI

```bash
streamlit run ui/streamlit_app.py --server.port 8501
```

4) Optional: Use real LLMs (OpenAI/Claude via LiteLLM)

Copy `.env.example` to `.env` and set one of the API keys. The code auto‑detects keys and upgrades from mock to live LLMs.

```bash
cp .env.example .env
# export OPENAI_API_KEY=... or ANTHROPIC_API_KEY=...
```

Structure

```
agentic-swarms/
  core/swarms/           # minimal core library
  examples/              # runnable demos
  ui/                    # Streamlit teaching UI
  notebooks/             # hands-on labs
  requirements.txt
  Makefile
  Dockerfile
```

Teaching Goals

- Understand roles, messages, tools, and orchestration patterns
- Practice coordination strategies (sequential, round‑robin, planner‑worker‑reviewer)
- Build a small SaaS planning swarm and extend with your own tools
- Visualize agent interactions to improve UI/UX understanding

Notes

- The mock strategy runs fully offline for classrooms without keys
- The LiteLLM provider supports OpenAI, Anthropic, and many others via a single API
- Keep agents small and composable; teach decomposition, ownership, and handoffs

