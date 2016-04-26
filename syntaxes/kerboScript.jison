

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

(PRINT|CLEARSCREEN|SET|EDIT|RUN)\b|[<>!=]"="       { return yytext.toUpperCase(); }


(["'])(?:(?=(\\?))\2.)*?\1  return 'STRING';
[0-9]+("."[0-9]+)?\b        return 'NUMBER';
[a-zA-Z][a-zA-Z0-9]*        return 'ID';
"."                         return 'DOT';
.                           return 'INVALID';

/lex

%token SET EDIT
%unassoc DOT


%start SourceElements

%% /* language grammar */

Program 
    : {{ $$ = ['PROGRAM',{}]; return $$;}}
    | SourceElements {{$$ = ['PROGRAM',{}, $1]; return $$;}}
    ;

SourceElements
    : Statement {{$$ = ['SourceElem',{}, $1]; return $$;}}
    | SourceElements Statement {{$$ = prependChild($3, ['SourceElem2',{}, $1, $2]); return $$;}}
    ;

Statement
    : 
        AssignStatement DOT
        |
        PrintStatement DOT
        |
        ClearStatement DOT

    ;
    
AssignStatement
    :
        SET ID {{ $$ = ['SET', $2 ] }}
    ;
    
PrintStatement
    : 
        PRINT STRING {{ $$ = ['PRINT', $2]}}
    ;
    
ClearStatement
    :
        CLEARSCREEN {{$$ = ['SourceElem2',{} ] }}
    ;
    
