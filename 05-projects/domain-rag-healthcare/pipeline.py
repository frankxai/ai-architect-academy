import os
import csv
import argparse
from typing import List, Dict

from sentence_transformers import SentenceTransformer
import numpy as np

try:
    from langchain.vectorstores import SupabaseVectorStore
    from langchain.embeddings.openai import OpenAIEmbeddings
except ImportError:
    SupabaseVectorStore = None
    OpenAIEmbeddings = None

EMBEDDING_MODEL = os.getenv('EMBEDDING_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')
DATA_FILE = os.getenv('DATA_FILE', 'data/clinical_guidelines.csv')


def load_corpus() -> List[Dict[str, str]]:
    with open(DATA_FILE, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)


def embed_texts(texts: List[str]):
    if EMBEDDING_MODEL.startswith('openai:') and OpenAIEmbeddings:
        model_name = EMBEDDING_MODEL.split(':', 1)[1]
        embeddings = OpenAIEmbeddings(model=model_name)
        return embeddings.embed_documents(texts)
    model = SentenceTransformer(EMBEDDING_MODEL)
    return model.encode(texts, convert_to_numpy=True)


def ingest():
    corpus = load_corpus()
    passages = [row['content'] for row in corpus]
    vectors = embed_texts(passages)
    os.makedirs('artifacts', exist_ok=True)
    np.save('artifacts/embeddings.npy', vectors)
    with open('artifacts/passages.txt', 'w', encoding='utf-8') as f:
        for row in corpus:
            f.write(f"{row['id']}	{row['title']}	{row['content']}\n")
    print(f"Ingested {len(corpus)} passages using model {EMBEDDING_MODEL}.")


def query(prompt: str):
    passages_file = 'artifacts/passages.txt'
    emb_file = 'artifacts/embeddings.npy'
    if not os.path.exists(passages_file) or not os.path.exists(emb_file):
        raise SystemExit('Run python pipeline.py ingest first.')

    with open(passages_file, encoding='utf-8') as f:
        rows = [line.strip().split('\t', 2) for line in f]
    passages = [row[2] for row in rows]
    titles = [row[1] for row in rows]
    vectors = np.load(emb_file)

    q_vec = embed_texts([prompt])[0]
    sims = np.dot(vectors, q_vec) / (np.linalg.norm(vectors, axis=1) * np.linalg.norm(q_vec) + 1e-8)
    top_indices = np.argsort(sims)[::-1][:3]

    print('\nTop matches:')
    for idx in top_indices:
        print(f"- {titles[idx]} (score={sims[idx]:.3f})")
        print(f"  {passages[idx][:240]}...\n")


def main():
    parser = argparse.ArgumentParser(description='Healthcare RAG pipeline utility')
    sub = parser.add_subparsers(dest='cmd', required=True)
    sub.add_parser('ingest')
    q_parser = sub.add_parser('query')
    q_parser.add_argument('prompt')
    args = parser.parse_args()

    if args.cmd == 'ingest':
        ingest()
    elif args.cmd == 'query':
        query(args.prompt)


if __name__ == '__main__':
    main()
