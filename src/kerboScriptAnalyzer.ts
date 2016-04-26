import * as vscode from 'vscode';

var fs = require('fs');
var Parser = require('jison').Parser;

export default class KerboScriptAnalyser{
    private extensionPath: string;
    
    public constructor(extensionPath: string){
        this.extensionPath = extensionPath;
    }
    
    public CreateDiagnostics(textDocument: vscode.TextDocument){
        let diagnostics: vscode.Diagnostic[] = [];
        let errors = vscode.languages.createDiagnosticCollection("languageErrors");
        
        try{
            let jisonDef = fs.readFileSync(this.extensionPath + '/syntaxes/kerboScript.jison', 'utf8');
            let parser = new Parser(jisonDef);
            let t = parser.parse(textDocument.getText());
            let asds = 42345;
        }catch(err){
            console.log(err);
            
            if (err.hash != undefined && err.hash.loc != undefined){
                let lineRange = new vscode.Range(err.hash.loc.first_line - 1, err.hash.loc.first_column, err.hash.loc.last_line - 1, err.hash.loc.last_column);
                let message = "Expected " + err.hash.expected[0] + " but got '" + err.hash.text + "'"
                diagnostics.push(new vscode.Diagnostic(lineRange, message, vscode.DiagnosticSeverity.Error));
            }
        }
        
        errors.set(textDocument.uri, diagnostics);
    }
}