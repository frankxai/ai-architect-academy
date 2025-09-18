import os
from dotenv import load_dotenv

REQUIRED_KEYS = [
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
]


def main() -> None:
    load_dotenv()

    missing = [key for key in REQUIRED_KEYS if not os.getenv(key)]

    if missing:
        print("Missing required keys: " + ", ".join(missing))
        raise SystemExit(1)

    print("All required provider keys are present.")


if __name__ == "__main__":
    main()