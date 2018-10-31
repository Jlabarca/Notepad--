ace.define('ace/snippets/makefile', ['require', 'exports', 'module'], (e, t, n) => {
  t.snippetText = 'snippet ifeq\n	ifeq (${1:cond0},${2:cond1})\n		${3:code}\n	endif\n', t.scope = 'makefile';
});
