const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const { regexpConstants, commandConstants, sortConstants, nameConstants } = require('./constants');
const path = require('path');

app();

function app() {
	console.log('Please, write your command!');
	readLine(processCommand);
}

function getFiles() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
	return filePaths.map(path => readFile(path));
}

function getFilesWithFileNames() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
	return filePaths.map(filePath => {
		const fileName = path.basename(filePath);
		const fileContent = readFile(filePath);
		return { fileName: fileName, content: fileContent };
	});
}

function getTodoList(parameters) {
	const important = parameters && parameters.important ? !!parameters.important : false;
	const user = parameters && parameters.user ? parameters.user : undefined;
	const sort = parameters && parameters.sort ? parameters.sort : undefined;
	const date = parameters && parameters.date ? new Date(parameters.date) : undefined;

	const files = getFilesWithFileNames();

	let todoList = [];

	files.map(file => {
		const lines = file.content.split("\n");
		lines.map(line => {
			if (regexpConstants.todo.test(line) && (important ? regexpConstants.important.test(line) : true)) {
				const lineParts = line.split(regexpConstants.todo)[1].split(';').map(line => line.trim());
				if (lineParts.length == 3 &&
					(user && user.length ? user.toLowerCase() == lineParts[0].toLowerCase() : true) &&
					(date ? date <= new Date(lineParts[1]) : true)
				) {
					todoList.push({
						important: regexpConstants.important.test(line) ? '!' : ' ',
						user: lineParts[0],
						date: lineParts[1],
						comment: lineParts[2],
						fileName: file.fileName
					});
				} else if (!user && !date) {
					todoList.push({
						important: regexpConstants.important.test(line) ? '!' : ' ',
						user: '',
						date: '',
						comment: lineParts[0],
						fileName: file.fileName
					});
				}
			}
		});
	});

	if (sort) {
		todoList = sortList(todoList, sort);
	}

	const formattedTodoList = formatTodoList(todoList);

	return formattedTodoList;
}

function formatTodoList(todoList) {
	const userLength = getValidFieldLength(todoList, nameConstants.user, 10);
	const dateLength = getValidFieldLength(todoList, nameConstants.date, 10);
	const commentLength = getValidFieldLength(todoList, nameConstants.comment, 50);
	const fileLength = getValidFieldLength(todoList, nameConstants.fileName, 15);

	const partsDivider = '  |  ';

	const header = [
		'  ' + nameConstants.important,
		nameConstants.user + ' '.repeat(userLength - nameConstants.user.length),
		nameConstants.date + ' '.repeat(dateLength - nameConstants.date.length),
		nameConstants.comment + ' '.repeat(commentLength - nameConstants.comment.length),
		nameConstants.fileName + ' '.repeat(fileLength - nameConstants.fileName.length + 2)
	].join(partsDivider);

	const divider = '-'.repeat(header.length);

	const formattedTodoList = [header, divider];
	formattedTodoList.push(...todoList.map(todo => {
		return [
			'  ' + todo.important,
			formatString(todo.user, userLength),
			formatString(todo.date, dateLength),
			formatString(todo.comment, commentLength),
			formatString(todo.fileName, fileLength) + '  '
		].join(partsDivider);
	}));
	if (formattedTodoList.length > 2) {
		formattedTodoList.push(divider);
	}
	return formattedTodoList.join('\n');
}

function formatString(string, maxLength) {
	if (string.length > maxLength) {
		return string.substring(0, maxLength - 3) + '...';
	}
	return string + ' '.repeat(maxLength - string.length);
};

function getValidFieldLength(list, field, maxLength, includeColumn = true) {
	let maxFieldLength = Math.max.apply(Math, list.map(item => item[field] ? item[field].length : 0));
	if (includeColumn) {
		maxFieldLength = maxFieldLength < field.length ? field.length : maxFieldLength;
	}
	const validLength = maxFieldLength < maxLength ? maxFieldLength : maxLength;
	return validLength;
}

function sortList(list, field) {
	function compare(a, b) {
		if (a[field] < b[field])
			return 1;
		if (a[field] > b[field])
			return -1;
		return 0;
	}

	function compareImportant(a, b) {
		if ((a.comment.match(new RegExp("!", "g")) || []).length < (b.comment.match(new RegExp("!", "g")) || []).length) {
			return 1;
		}
		if ((a.comment.match(new RegExp("!", "g")) || []).length > (b.comment.match(new RegExp("!", "g")) || []).length) {
			return -1;
		}
		return 0;
	}

	if (field == sortConstants.importance) {
		return list.sort(compareImportant);
	} else {
		return list.sort(compare);
	}
}

function processCommand(command) {
	switch (command) {
		case 'exit':
			process.exit(0);
			break;
		case 'show':
			const todoList = getTodoList();
			console.log(todoList);
			break;
		case 'important':
			console.log(getTodoList({ important: true }));
			break;
		case (command.match(regexpConstants.user) && command.match(regexpConstants.user).input):
			const user = command.substring(commandConstants.user.length + 1);
			console.log(getTodoList({ user }));
			break;
		case (command.match(regexpConstants.sort) && command.match(regexpConstants.sort).input):
			const sortField = command.substring(commandConstants.sort.length + 1);
			console.log(getTodoList({ sort: sortConstants[sortField] }));
			break;
		case (command.match(regexpConstants.date) && command.match(regexpConstants.date).input):
			const date = command.substring(commandConstants.date.length + 1);
			console.log(getTodoList({ date }));
			break;
		default:
			console.log('wrong command');
			break;
	}
}

// TODO you can do it!