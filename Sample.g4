grammar Sample;

program: statement;

statement: expr;

expr: 'banana';

ID: [a-zA-Z]+;
INT: [0-9]+;

WS : [ \t\r\n]+ -> skip; // skip spaces, tabs, newlines
