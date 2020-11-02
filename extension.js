const vscode = require('vscode');
let i18n = require('./i18n');
var fs = require("fs");

const customerFilePath = vscode.workspace.getConfiguration("i18n").get('filePath')
if (customerFilePath.endsWith('.js') && fs.existsSync(customerFilePath)) {
    i18n = require(customerFilePath);
} else {
    vscode.window.showInformationMessage('Customer Setting i18n.filePath is Invalid.');
}
const keyword = vscode.workspace.getConfiguration("i18n").get('keyword');
const filePathKeyword = vscode.workspace.getConfiguration("i18n").get('filePathKeyword');

/**
 * 自动提示实现，这里模拟一个很简单的操作
 * @param {*} document 
 * @param {*} position 
 * @param {*} token 
 * @param {*} context 
 */
function provideCompletionItems(document, position, token, context) {
    const line        = document.lineAt(position);

    // 只截取到光标位置为止，防止一些特殊情况
    const lineText = line.text.substring(0, position.character);
    const keywordRegExp = new RegExp(`${keyword}\\.$`, 'g');
    const filePathKeywordRegExp = new RegExp(`${filePathKeyword}\\.$`, 'g');
    if(filePathKeywordRegExp.test(lineText)) {
		
        return Object.keys(i18n).map(key => {
            return new vscode.CompletionItem(`${key} || '${i18n[key]}'`, vscode.CompletionItemKind.Field);
        })
    } else if(keywordRegExp.test(lineText)) {
        const list = vscode.workspace.getConfiguration("i18n").get('list');
        return list.map(key => {
            return new vscode.CompletionItem(`${key}`, vscode.CompletionItemKind.Field);
        })
    }
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item 
 * @param {*} token 
 */
function resolveCompletionItem(item, token) {
    return null;
}


exports.activate = function activate(context) {
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems,
        resolveCompletionItem
    }, '.'));
}

// document.getText(document.getWordRangeAtPosition(position))