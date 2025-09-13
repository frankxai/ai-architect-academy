VENV=.venv
PY=$(VENV)/bin/python
PIP=$(VENV)/bin/pip

.PHONY: venv install hello ui test clean

venv:
	python3 -m venv $(VENV)
	. $(VENV)/bin/activate

install: venv
	$(PIP) install -r requirements.txt

hello:
	$(PY) examples/hello_swarm.py --goal "Create a tiny function to add two numbers"

ui:
	$(VENV)/bin/streamlit run ui/streamlit_app.py --server.port 8501

clean:
	rm -rf $(VENV)
