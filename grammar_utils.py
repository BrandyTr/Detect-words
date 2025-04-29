import re
from config import SRC

def get_words_from_terminal():
    words = input("Enter the words (separated  by commas): ")
    return [word.strip() for word in words.split(',')]

def append_to_grammar_file(words):
    # Open the .g4 to read current content
    try:
        with open(SRC, 'r', encoding='utf-8') as g4file:
            grammar_content = g4file.read()
    except FileNotFoundError:
        grammar_content = """grammar Sample;

program: statement;

statement: expr;

expr: 'banana';

ID: [a-zA-Z]+;
INT: [0-9]+;

WS : [ \\t\\r\\n]+ -> skip; // skip spaces, tabs, newlines
"""

    # Extract existing words from the grammar correctly
    existing_words = []
    if 'expr:' in grammar_content:
        expr_pos = grammar_content.find('expr: ') + len('expr: ')
        expr_end = grammar_content.find(';', expr_pos)
        expr_rule = grammar_content[expr_pos:expr_end]
        
        # ⚡ FIX regex to capture full words
        existing_words = re.findall(r"'([^']+)'", expr_rule)

    # Add new words that are not already in existing_words
    words_to_add = [word for word in words if word and word not in existing_words]

    if not words_to_add:
        print("No new words to add - all words already exist in the grammar.")
        return

    # Merge existing + new words, sort them
    all_words = sorted(set(existing_words + words_to_add))

    # Define new expr rule
    new_expr = "expr: " + " | ".join(f"'{word}'" for word in all_words) + ";"

    # Replace the old expr rule with the new one
    if 'expr:' in grammar_content:
        expr_start = grammar_content.find('expr:')
        expr_end = grammar_content.find(';', expr_start) + 1
        grammar_content = grammar_content[:expr_start] + new_expr + grammar_content[expr_end:]
    else:
        # If expr rule is missing, just add it
        grammar_content = grammar_content.replace('expr: ;', new_expr)

    # Save updated grammar
    with open(SRC, 'w', encoding='utf-8') as g4file:
        g4file.write(grammar_content)

    print(f"Grammar file updated successfully! Added {len(words_to_add)} new word(s).")
    
def resetGrammarFile():
    default_grammar = """grammar Sample;

program: statement;

statement: expr;

expr: 'banana';

ID: [a-zA-Z]+;
INT: [0-9]+;

WS : [ \\t\\r\\n]+ -> skip; // skip spaces, tabs, newlines
"""
    try:
        with open(SRC, 'w', encoding='utf-8') as g4file:
            g4file.write(default_grammar)
        print(f"Grammar file {SRC} has been reset to default.")
    except Exception as e:
        print(f"Error resetting grammar file: {e}")