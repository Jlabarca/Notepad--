ace.define('ace/snippets/maze', ['require', 'exports', 'module'], (e, t, n) => {
  t.snippetText = 'snippet >\ndescription assignment\nscope maze\n	-> ${1}= ${2}\n\nsnippet >\ndescription if\nscope maze\n	-> IF ${2:**} THEN %${3:L} ELSE %${4:R}\n', t.scope = 'maze';
});
