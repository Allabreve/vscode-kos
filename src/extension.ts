'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { KOS_MODE } from './kosMode';
//import * as lexxy from 'lexxy';

var lexxy = require('lexxy'); 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "kos" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});
    
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(KOS_MODE, new KosCompletionItemProvider(), '.'));

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class LexingStruct{
    constructor(name: string, exp: RegExp){
        this.name = name;
        this.expression = exp;        
    }
    
    name: string;
    expression: RegExp;
}

export class KosCompletionItemProvider implements vscode.CompletionItemProvider {

	private koscodeConfigurationComplete = false;
    
    private lexingStuff : LexingStruct[] = [
        new LexingStruct("NOT", /not/i),
        new LexingStruct("AND", /and/i),
        
        new LexingStruct("OR", /or/i),
        // Some of these elements can't be reused for word completion, as the words are value
        // This can probably be properly catered for when detecting variables.
        //new LexingStruct("TRUEFALSE", /true|false
        //new LexingStruct("COMPARATOR=<>|>=|<=|=|>|<
        //Instructions tokens
        new LexingStruct("SET", /set/i),
        new LexingStruct("TO", /to/i),
        new LexingStruct("IS", /is/i),
        new LexingStruct("IF", /if/i),
        new LexingStruct("ELSE", /else/i),
        new LexingStruct("UNTIL", /until/i),
        new LexingStruct("STEP", /step/i),
        new LexingStruct("DO", /do/i),
        new LexingStruct("LOCK", /lock/i),
        new LexingStruct("UNLOCK", /unlock/i),
        new LexingStruct("PRINT", /print/i),
        new LexingStruct("AT", /at/i),
        new LexingStruct("ON", /on/i),
        new LexingStruct("TOGGLE", /toggle/i),
        new LexingStruct("WAIT", /wait/i),
        new LexingStruct("WHEN", /when/i),
        new LexingStruct("THEN", /then/i),
        new LexingStruct("OFF", /off/i),
        new LexingStruct("STAGE", /stage/i),
        new LexingStruct("CLEARSCREEN", /clearscreen/i),
        new LexingStruct("ADD", /add/i),
        new LexingStruct("REMOVE", /remove/i),
        new LexingStruct("LOG", /log/i),
        new LexingStruct("BREAK", /break/i),
        new LexingStruct("PRESERVE", /preserve/i),
        new LexingStruct("DECLARE", /declare/i),
        new LexingStruct("DEFINED", /defined/i),
        new LexingStruct("LOCAL", /local/i),
        new LexingStruct("GLOBAL", /global/i),
        new LexingStruct("PARAMETER", /parameter/i),
        new LexingStruct("FUNCTION", /function/i),
        new LexingStruct("RETURN", /return/i),
        new LexingStruct("SWITCH", /switch/i),
        new LexingStruct("COPY", /copy/i),
        new LexingStruct("FROM", /from/i),
        new LexingStruct("RENAME", /rename/i),
        new LexingStruct("VOLUME", /volume/i),
        new LexingStruct("FILE", /file/i),
        new LexingStruct("DELETE", /delete/i),
        new LexingStruct("EDIT", /edit/i),
        new LexingStruct("RUN", /run/i),
        new LexingStruct("ONCE", /once/i),
        new LexingStruct("COMPILE", /compile/i),
        new LexingStruct("LIST", /list/i),
        new LexingStruct("REBOOT", /reboot/i),
        new LexingStruct("SHUTDOWN", /shutdown/i),
        new LexingStruct("FOR", /for/i),
        new LexingStruct("UNSET", /unset/i),
    ];
    
    

	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {      
        return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
            var lexer = new lexxy.Lexer();
            var allWords : string[] = ['TRUE', 'FALSE']; // Adding intial options that don't fit the lexingStuff structure, but are valid for completion
            
            for(var thing in this.lexingStuff){
                var t = this.lexingStuff[thing];
                lexer.type(t.name, t.expression);
                allWords.push(t.name);
            }
            
            let filename = document.fileName;

            if (document.lineAt(position.line).text.match(/^\s*\/\//)) {
                return resolve([]);
            }

            // get current word
            let wordAtPosition = document.getWordRangeAtPosition(position);
            let currentWord = '';
            if (wordAtPosition && wordAtPosition.start.character < position.character) {
                let word = document.getText(wordAtPosition);
                currentWord = word.substr(0, position.character - wordAtPosition.start.character);
            }
            

            var tokens = lexer.lex(currentWord);
            
             var completion : vscode.CompletionItem[] = []; 
            // for(var token in tokens){
            //    var t2 = new vscode.CompletionItem(tokens[token].type.name);
            //    t2.kind = vscode.CompletionItemKind.Keyword;
            //    t2.insertText = tokens[token].type.name;
            //    completion.push(t2);
            // }
            
            if (completion.length == 0){
                var matching = allWords.filter(word => word.toLowerCase().startsWith(currentWord.toLowerCase()));
                for(let match in matching){
                    var t3 = new vscode.CompletionItem(matching[match]);
                    t3.kind = vscode.CompletionItemKind.Keyword;
                    t3.insertText = matching[match].toUpperCase();
                    completion.push(t3);
                }
            }
            
            return resolve(completion);
        });
    }
}