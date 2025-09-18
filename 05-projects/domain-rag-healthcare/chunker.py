from typing import List

try:
    from medspacy.context import ConText
    from medspacy.context import ConTextRule
except ImportError:
    ConText = None

def medical_chunk(text: str) -> List[str]:
    if ConText is None:
        return [chunk.strip() for chunk in text.split('.') if chunk.strip()]
    context = ConText()
    context.add_rule(ConTextRule('because', '', 'FAMILY', direction='forward'))
    doc = context.nlp(text)
    return [sent.text.strip() for sent in doc.sents]
