const ace = require('../..');
require('../../mode/javascript');
require('../../theme/monokai');

const editor = ace.edit('javascript-editor');
editor.getSession().setMode('ace/mode/javascript');
editor.setTheme('ace/theme/monokai');
editor.setValue([
  '// JavaScript',
  'var a = 3;',
  '',
  '// below line has an error which is annotated',
  'var b =',
].join('\n'));
editor.clearSelection();
