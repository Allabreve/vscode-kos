

%{
    function prependChild(node, child){
      node.splice(2,0,child); 
      return node;
    };
%}


%lex
%%
\s+                         /* skip whitespace */;
"//".*                      /* ignore comment */;

(PRINT|CLEARSCREEN|SET|TO|EDIT|RUN|FROM|UNTIL|STEP|DO|WAIT)\b|[<>!=]"="       { return yytext.toUpperCase(); }


(["'])(?:(?=(\\?))\2.)*?\1  return 'STRING';
[0-9]+("."[0-9]+)?\b        return 'NUMBER';
[a-zA-Z][a-zA-Z0-9]*        return 'ID';
"{"                         return 'LBRACE';
"}"                         return 'RBRACE';
"="                         return 'EQUAL';
"."                         return 'DOT';
.                           return 'INVALID';

/lex

%token SET EDIT TO
%unassoc DOT


%start Program

%% /* language grammar */

Program 
    :  SourceElements {{$$ = ['PROGRAM',{}, $1]; return $$; }}
    ;

SourceElements
    : Statement {{$$ = ['SourceElem',{}, $1]; }}
    | SourceElements Statement {{$$ = $1; $1.push( $2 );}}
    ;

Statement
    : 
        AssignStatement DOT
        |
        PrintStatement DOT
        |
        ClearStatement DOT
        |
        WaitStatement DOT
        |
        FromLoopStatement
    ;
    
AssignStatement
    :
        SET ID {{ $$ = ['SET', $2 ];  }}
        | SET ID TO Expression {{ $$ = ['SET', $2, $4 ];  }}
    ;
    
Expression
    :
       NUMBER | KsString | ID
    ;
    
PrintStatement
    : 
        PRINT Expression {{ $$ = ['PRINT', $2];}}
    ;

WaitStatement
    :
        WAIT NUMBER {{ $$ = ['WAIT', $2];}}
    ;
       
ClearStatement
    :
        CLEARSCREEN {{$$ = ['CLEARSCREEN',{} ]; }}
    ;
    
KsString
    :
        STRING {{ $$ = ['STRING', { 'value' : $1, 'pos' : @1}]; }}
    ;
   
BraceStatement
    :
        LBRACE Statement RBRACE
    ; 

BraceSourceElements
    :
        LBRACE SourceElements RBRACE
    ;
    
Comparison
    :
        Expression EQUAL Expression
    ;
            
FromLoopStatement
    :
        FROM BraceStatement UNTIL Comparison STEP BraceStatement DO BraceSourceElements {{ $$ = ['FROM', $2, $4, $6, $8]; }}
    ;