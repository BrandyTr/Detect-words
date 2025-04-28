import subprocess
from config import ANTLR_JAR, CPL_Dest, SRC

def generateAntlr2Python(words):
    # add the words in terminal into the grammar file
    from grammar_utils import append_to_grammar_file
    append_to_grammar_file(words)
    
    print('Antlr4 is running...')
    subprocess.run(['java', '-jar', ANTLR_JAR, '-o', CPL_Dest, '-no-listener', '-Dlanguage=Python3', SRC])
    print('Generate successfully')