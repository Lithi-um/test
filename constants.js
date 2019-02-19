const regexpConstants = {
	todo: /\/\/\sTODO\s/i,
	important: /!/,
	user: /user\s[(\w*)(\d*)(\W*)(\D*)]*/,
	sort: /sort\s(importance|user|date)/,
	date: /date\s(\d{4})|(\-(0[1-9]|1[012])|(\-(3[01]|[12][0-9]|0[1-9])))/
};

const commandConstants = {
	user: 'user',
	sort: 'sort',
	date: 'date'
};

const sortConstants = {
	importance: 'important',
	user: 'user',
	date: 'date'
};

const nameConstants = {
	user: 'user',
	date: 'date',
	comment: 'comment',
	fileName: 'fileName',
	important: '!'
};

module.exports = {
  regexpConstants,
  commandConstants,
  sortConstants,
  nameConstants
};
