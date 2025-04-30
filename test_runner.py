import os
from antlr4 import FileStream, CommonTokenStream, Token
from antlr4.error.ErrorListener import ErrorListener
from config import TESTS, SRC

def runTest():
    print('Running testcases...')
    
    #import the generated files only when running tests
    try:
        from CompiledFiles.SampleLexer import SampleLexer
        from CompiledFiles.SampleParser import SampleParser
    except ImportError:
        print("Error: ANTLR-generated files not found. Please run 'python run.py gen' first.")
        return
    
    class CustomErrorListener(ErrorListener):
        def syntaxError(self, recognizer, offendingSymbol, line, column, msg, e):
            print(f"Input rejected: {msg}")
            exit(1)
            
    accepted_words = set()
    try:
        with open(SRC, 'r') as g4file:
            grammar_content = g4file.read()
            if 'expr:' in grammar_content:
                expr_pos = grammar_content.find('expr: ') + len('expr: ')
                expr_end = grammar_content.find(';', expr_pos)
                expr_rule = grammar_content[expr_pos:expr_end]
                
                # extract words between single quotes
                import re
                accepted_words = set(re.findall(r"'([^']*)'", expr_rule))
    except FileNotFoundError:
        print("Grammar file not found.")
        return

    print(f"Accepted words from grammar: {', '.join(accepted_words)}")
    print("-----------------------------------------------")
    
    #loop all files txt
    for filename in os.listdir(TESTS):
        if filename.endswith('.txt'):
            inputFile = os.path.join(TESTS, filename)
            print(f"Processing file: {filename}")
            
            #create lexer & token stream
            print('List of token: ')
            lexer = SampleLexer(FileStream(inputFile))
            tokens = [] #initialize empty lists  to hold token
            token_texts = [] # store just the text of tokens for checking
            
            token = lexer.nextToken()
            while token.type != Token.EOF:
                tokens.append(token)
                token_texts.append(token.text)
                token = lexer.nextToken()
                
            tokens.append('<EOF>')
            print(','.join(token_texts + ['<EOF>']))
            
            # check if any duplicated token
            word_found = False
            for token_text in token_texts:
                if token_text in accepted_words:
                    word_found = True
                    break
                
            if word_found:
                print("Input accepted: Found an accepted word in the file.")
            else:
                print("Input rejected: No accepted words found in the file.")
                
            # For debugging, still show the parse tree
            try:
                input_stream = FileStream(inputFile)
                lexer = SampleLexer(input_stream)
                stream = CommonTokenStream(lexer)
                parser = SampleParser(stream)
                tree = parser.program()  # Start parsing at the `program` rule
                print("Parse tree:", tree.toStringTree(recog=parser))
            except Exception as e:
                print(f"Parser error (for information only): {str(e)}")
            
            print("-----------------------------------------------")

    print('Run tests completely')
def runTestWord(word):
    print(f"Running test with word: '{word}'")

    try:
        from CompiledFiles.SampleLexer import SampleLexer
        from CompiledFiles.SampleParser import SampleParser
    except ImportError:
        print("Error: ANTLR-generated files not found. Please run 'python run.py gen' first.")
        return

    from antlr4 import InputStream

    class CustomErrorListener(ErrorListener):
        def syntaxError(self, recognizer, offendingSymbol, line, column, msg, e):
            print(f"Input rejected: {msg} (line {line}:{column})")
            exit(1)

    # Load accepted words from grammar
    accepted_words = set()
    try:
        with open(SRC, 'r') as g4file:
            grammar_content = g4file.read()
            if 'expr:' in grammar_content:
                expr_pos = grammar_content.find('expr: ') + len('expr: ')
                expr_end = grammar_content.find(';', expr_pos) #start scanning after expr: 
                expr_rule = grammar_content[expr_pos:expr_end]

                import re
                accepted_words = set(re.findall(r"'([^']*)'", expr_rule))
    except FileNotFoundError:
        print("Grammar file not found.")
        return

    print(f"Accepted words from grammar: {', '.join(accepted_words)}")
    print("-----------------------------------------------")

    print("List of tokens:")
    input_stream = InputStream(word)
    lexer = SampleLexer(input_stream)
    token_stream = CommonTokenStream(lexer)

    token_texts = []
    token = lexer.nextToken()
    while token.type != Token.EOF:
        token_texts.append(token.text)
        token = lexer.nextToken()

    print(', '.join(token_texts + ['<EOF>']))

    # Check if any token is in accepted words
    found = any(t in accepted_words for t in token_texts)
    if found:
        print("Input accepted: Word is listed in accepted words.")
    else:
        print("Input rejected: Word not found in accepted words.")

    # Try parsing
    print("Parsing input...")
    try:
        input_stream = InputStream(word)
        lexer = SampleLexer(input_stream)
        stream = CommonTokenStream(lexer)
        parser = SampleParser(stream)
        parser.removeErrorListeners()
        parser.addErrorListener(CustomErrorListener())
        tree = parser.program()
        print("Parse tree:", tree.toStringTree(recog=parser))
    except Exception as e:
        print(f"Parser error: {str(e)}")

    print("-----------------------------------------------")
