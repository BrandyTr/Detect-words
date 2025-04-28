import re
from config import SRC

def get_words_from_terminal():
    words = input("Enter the words (separated  by commas): ")
    return [words.strip() for word in words.split(',')]

def append_to_grammar_file(words):
    #open the .g4 to read current content
    
    try:
        with open(SRC, 'r') as g4file:
            grammar_content = g4file.read()
    except FileNotFoundError:
        grammar_content = """grammar Sample;

program: statement;

statement: expr;

expr: 'banana';

ID: [a-zA-Z]+;
INT: [0-9]+;

WS : [ \t\r\n]+ -> skip; // skip spaces, tabs, newlines
"""

    #extract existing words in .g4 using regex
    existing_words = []
    if 'expr:' in grammar_content:
        expr_pos = grammar_content.find('expr: ') + len('expr: ')
        expr_end = grammar_content.find(';', expr_pos)
        expr_rule = grammar_content[expr_pos:expr_end] # expr_rule = "'ID' | 'INT'"
        
        #extract words between single quotes in to array
        existing_words = re.findall(r"'([^'])'", expr_rule)
        
    # add words if it's new
    words_to_add = []
    for word in words:
        if word and word not in existing_words:
            words_to_add.append(word)
            existing_words.append(word)
            
    if not words_to_add:
        print("No new words to add - all words already exist in the grammar.")
        return
    
    # defined expr rule for new words
    new_expr = "expr: " + " | ".join([f"'{word}'" for word in existing_words]) + ";"
    
    #refine entire expr rule in grammar
    if 'expr:' in grammar_content:
        expr_start = grammar_content.find('expr:')
        expr_end = grammar_content.find(';', expr_start)  + 1
        grammar_content = grammar_content[:expr_start] + new_expr + grammar_content[expr_end:]
    else:
        # if expr rule is missing, add it
        grammar_content = grammar_content.replace('expr: ;', new_expr)
        
    #update content into .g4
    with open(SRC, 'w') as g4file:
        g4file.write(grammar_content)
        
    print(f"Grammar file updated successfully! Added {len(words_to_add)} new word(s).")