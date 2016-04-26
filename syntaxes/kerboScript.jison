


%lex
%%
\s+                         /* skip whitespace */;
"//".*                      /* ignore comment */;

("PRINT")\b|[<>!=]"="       { return yytext; }

(["'])(?:(?=(\\?))\2.)*?\1  return 'STRING';
"."                         return 'DOT';
.                           return 'INVALID'

/lex

%{
    function prependChild(node, child){
      node.splice(2,0,child); 
      return node;
    }
%}


%unassoc DOT

%start Program

%% /* language grammar */

Program 
    : {{ $$ = ['PROGRAM',{}]; return $$;}}
    | SourceElements {{$$ = ['PROGRAM',{}, $1]; return $$;}};

SourceElements
    : Statement {$$ = ['SourceElem',{}, $1]; return $$;}}
    | SourceElements Statement {$$ = ['SourceElem2',{}, $1, $2]; return $$;}}
    ;

Statement
    : 
        PRINT STRING DOT { $$ = ['PRINT', $2]}
    ;