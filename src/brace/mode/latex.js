ace.define('ace/mode/latex_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;

  const LatexHighlightRules = function () {
    this.$rules = {
      start: [{
        token: 'comment',
        regex: '%.*$',
      }, {
        token: ['keyword', 'lparen', 'variable.parameter', 'rparen', 'lparen', 'storage.type', 'rparen'],
        regex: '(\\\\(?:documentclass|usepackage|input))(?:(\\[)([^\\]]*)(\\]))?({)([^}]*)(})',
      }, {
        token: ['keyword', 'lparen', 'variable.parameter', 'rparen'],
        regex: '(\\\\(?:label|v?ref|cite(?:[^{]*)))(?:({)([^}]*)(}))?',
      }, {
        token: ['storage.type', 'lparen', 'variable.parameter', 'rparen'],
        regex: '(\\\\begin)({)(verbatim)(})',
        next: 'verbatim',
      }, {
        token: ['storage.type', 'lparen', 'variable.parameter', 'rparen'],
        regex: '(\\\\begin)({)(lstlisting)(})',
        next: 'lstlisting',
      }, {
        token: ['storage.type', 'lparen', 'variable.parameter', 'rparen'],
        regex: '(\\\\(?:begin|end))({)([\\w*]*)(})',
      }, {
        token: 'storage.type',
        regex: /\\verb\b\*?/,
        next: [{
          token: ['keyword.operator', 'string', 'keyword.operator'],
          regex: '(.)(.*?)(\\1|$)|',
          next: 'start',
        }],
      }, {
        token: 'storage.type',
        regex: '\\\\[a-zA-Z]+',
      }, {
        token: 'lparen',
        regex: '[[({]',
      }, {
        token: 'rparen',
        regex: '[\\])}]',
      }, {
        token: 'constant.character.escape',
        regex: '\\\\[^a-zA-Z]?',
      }, {
        token: 'string',
        regex: '\\${1,2}',
        next: 'equation',
      }],
      equation: [{
        token: 'comment',
        regex: '%.*$',
      }, {
        token: 'string',
        regex: '\\${1,2}',
        next: 'start',
      }, {
        token: 'constant.character.escape',
        regex: '\\\\(?:[^a-zA-Z]|[a-zA-Z]+)',
      }, {
        token: 'error',
        regex: '^\\s*$',
        next: 'start',
      }, {
        defaultToken: 'string',
      }],
      verbatim: [{
        token: ['storage.type', 'lparen', 'variable.parameter', 'rparen'],
        regex: '(\\\\end)({)(verbatim)(})',
        next: 'start',
      }, {
        defaultToken: 'text',
      }],
      lstlisting: [{
        token: ['storage.type', 'lparen', 'variable.parameter', 'rparen'],
        regex: '(\\\\end)({)(lstlisting)(})',
        next: 'start',
      }, {
        defaultToken: 'text',
      }],
    };

    this.normalizeRules();
  };
  oop.inherits(LatexHighlightRules, TextHighlightRules);

  exports.LatexHighlightRules = LatexHighlightRules;
});

ace.define('ace/mode/folding/latex', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/folding/fold_mode', 'ace/range', 'ace/token_iterator'], (acequire, exports, module) => {
  const oop = acequire('../../lib/oop');
  const BaseFoldMode = acequire('./fold_mode').FoldMode;
  const Range = acequire('../../range').Range;
  const TokenIterator = acequire('../../token_iterator').TokenIterator;
  const keywordLevels = {
    '\\subparagraph': 1,
    '\\paragraph': 2,
    '\\subsubsubsection': 3,
    '\\subsubsection': 4,
    '\\subsection': 5,
    '\\section': 6,
    '\\chapter': 7,
    '\\part': 8,
    '\\begin': 9,
    '\\end': 10,
  };

  const FoldMode = exports.FoldMode = function () {};

  oop.inherits(FoldMode, BaseFoldMode);

  (function () {
    this.foldingStartMarker = /^\s*\\(begin)|\s*\\(part|chapter|(?:sub)*(?:section|paragraph))\b|{\s*$/;
    this.foldingStopMarker = /^\s*\\(end)\b|^\s*}/;

    this.getFoldWidgetRange = function (session, foldStyle, row) {
      const line = session.doc.getLine(row);
      var match = this.foldingStartMarker.exec(line);
      if (match) {
        if (match[1]) { return this.latexBlock(session, row, match[0].length - 1); }
        if (match[2]) { return this.latexSection(session, row, match[0].length - 1); }

        return this.openingBracketBlock(session, '{', row, match.index);
      }

      var match = this.foldingStopMarker.exec(line);
      if (match) {
        if (match[1]) { return this.latexBlock(session, row, match[0].length - 1); }

        return this.closingBracketBlock(session, '}', row, match.index + match[0].length);
      }
    };

    this.latexBlock = function (session, row, column, returnRange) {
      const keywords = {
        '\\begin': 1,
        '\\end': -1,
      };

      const stream = new TokenIterator(session, row, column);
      let token = stream.getCurrentToken();
      if (!token || !(token.type == 'storage.type' || token.type == 'constant.character.escape')) { return; }

      const val = token.value;
      const dir = keywords[val];

      const getType = function () {
        const token = stream.stepForward();
        const type = token.type == 'lparen' ? stream.stepForward().value : '';
        if (dir === -1) {
          stream.stepBackward();
          if (type) { stream.stepBackward(); }
        }
        return type;
      };
      const stack = [getType()];
      const startColumn = dir === -1 ? stream.getCurrentTokenColumn() : session.getLine(row).length;
      const startRow = row;

      stream.step = dir === -1 ? stream.stepBackward : stream.stepForward;
      while (token = stream.step()) {
        if (!token || !(token.type == 'storage.type' || token.type == 'constant.character.escape')) { continue; }
        const level = keywords[token.value];
        if (!level) { continue; }
        const type = getType();
        if (level === dir) { stack.unshift(type); } else if (stack.shift() !== type || !stack.length) { break; }
      }

      if (stack.length) { return; }

      if (dir == 1) {
        stream.stepBackward();
        stream.stepBackward();
      }

      if (returnRange) { return stream.getCurrentTokenRange(); }

      var row = stream.getCurrentTokenRow();
      if (dir === -1) { return new Range(row, session.getLine(row).length, startRow, startColumn); }
      return new Range(startRow, startColumn, row, stream.getCurrentTokenColumn());
    };

    this.latexSection = function (session, row, column) {
      const stream = new TokenIterator(session, row, column);
      let token = stream.getCurrentToken();
      if (!token || token.type != 'storage.type') { return; }

      const startLevel = keywordLevels[token.value] || 0;
      let stackDepth = 0;
      let endRow = row;

      while (token = stream.stepForward()) {
        if (token.type !== 'storage.type') { continue; }
        const level = keywordLevels[token.value] || 0;

        if (level >= 9) {
          if (!stackDepth) { endRow = stream.getCurrentTokenRow() - 1; }
          stackDepth += level == 9 ? 1 : -1;
          if (stackDepth < 0) { break; }
        } else if (level >= startLevel) { break; }
      }

      if (!stackDepth) { endRow = stream.getCurrentTokenRow() - 1; }

      while (endRow > row && !/\S/.test(session.getLine(endRow))) { endRow--; }

      return new Range(
        row, session.getLine(row).length,
        endRow, session.getLine(endRow).length,
      );
    };
  }).call(FoldMode.prototype);
});

ace.define('ace/mode/latex', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/latex_highlight_rules', 'ace/mode/behaviour/cstyle', 'ace/mode/folding/latex'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextMode = acequire('./text').Mode;
  const LatexHighlightRules = acequire('./latex_highlight_rules').LatexHighlightRules;
  const CstyleBehaviour = acequire('./behaviour/cstyle').CstyleBehaviour;
  const LatexFoldMode = acequire('./folding/latex').FoldMode;

  const Mode = function () {
    this.HighlightRules = LatexHighlightRules;
    this.foldingRules = new LatexFoldMode();
    this.$behaviour = new CstyleBehaviour({ braces: true });
  };
  oop.inherits(Mode, TextMode);

  (function () {
    this.type = 'text';

    this.lineCommentStart = '%';

    this.$id = 'ace/mode/latex';

    this.getMatching = function (session, row, column) {
      if (row == undefined) { row = session.selection.lead; }
      if (typeof row === 'object') {
        column = row.column;
        row = row.row;
      }

      const startToken = session.getTokenAt(row, column);
      if (!startToken) { return; }
      if (startToken.value == '\\begin' || startToken.value == '\\end') {
        return this.foldingRules.latexBlock(session, row, column, true);
      }
    };
  }).call(Mode.prototype);

  exports.Mode = Mode;
});
