import sys
from config import ANTLR_JAR
from grammar_utils import get_words_from_terminal
from antlr_utils import generateAntlr2Python
from test_runner import runTest

def printUsage():
    print('python run.py gen')
    print('python run.py test')

def printBreak():
    print('-----------------------------------------------')

def main(argv):
    print('Complete jar file ANTLR  :  ' + str(ANTLR_JAR))
    print('Length of arguments      :  ' + str(len(argv)))    
    printBreak()

    if len(argv) < 1:
        printUsage()
    elif argv[0] == 'gen':
        words = get_words_from_terminal()  # Get words from terminal
        generateAntlr2Python(words)    
    elif argv[0] == 'test':
        runTest()  # Pass an empty list to use the default behavior
    else:
        printUsage()

if __name__ == '__main__':
    main(sys.argv[1:])
