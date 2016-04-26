


%lex
%%
\s+                         /* skip whitespace */;
"//".*                      /* ignore comment */;

("PRINT")\b|[<>!=]"="       { return yytext; }

(["'])(?:(?=(\\?))\2.)*?\1  return 'STRING';
"."                         return 'DOT';
.                           return 'INVALID'

/lex


%unassoc DOT

%start Program

%% /* language grammar */

Program 
    : 
    | SourceElements;

SourceElements
    : Statement
    | SourceElements Statement
    ;

Statement
    : 
        PRINT STRING DOT
    ;