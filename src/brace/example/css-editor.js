const ace = require('brace');
require('brace/mode/css');
require('brace/theme/solarized_light');

const editor = ace.edit('css-editor');
editor.setTheme('ace/theme/solarized_light');
editor.getSession().setMode('ace/mode/css');
