const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

app();

function app () {
    const files = getFiles();
    getTODOList();
    console.log('Please, write your command!');
    readLine(processCommand);
}

function getFiles () {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getFilesWithExtension() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => {
        const fileName=path.slice(path.lastIndexOf("/") + 1);
        const fileContent=readFile(path);
        return { fileName: fileName, content: fileContent };
    });
}

function getTODOList() {
    const todoText = "// "+"TODO";
    const files=getFilesWithExtension();
    const todoList=[];
    const maxContextLength = 0;
    const maxAuthorLength = 0;
    files.map(file => {
        const lines = file.content.split("\n");
        lines.map(line => {
            if (line.includes(todoText.toUpperCase())) {
                const todoStr = line.slice(line.indexOf(todoText) + todoText.length) + ";" + file.fileName;
                const formattedTodo = formatTodo(todoStr);
                todoList.push(formattedTodo);
            }
        });
    })
}

function processCommand (command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const todoList = getTODOList();
            console.log(todoList);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
