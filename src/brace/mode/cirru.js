ace.define('ace/mode/cirru_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;
  const CirruHighlightRules = function () {
    this.$rules = {
      start: [{
        token: 'constant.numeric',
        regex: /[\d\.]+/,
      }, {
        token: 'comment.line.double-dash',
        regex: /--/,
        next: 'comment',
      }, {
        token: 'storage.modifier',
        regex: /\(/,
      }, {
        token: 'storage.modifier',
        regex: /,/,
        next: 'line',
      }, {
        token: 'support.function',
        regex: /[^\(\)"\s]+/,
        next: 'line',
      }, {
        token: 'string.quoted.double',
        regex: /"/,
        next: 'string',
      }, {
        token: 'storage.modifier',
        regex: /\)/,
      }],
      comment: [{
        token: 'comment.line.double-dash',
        regex: / +[^\n]+/,
        next: 'start',
      }],
      string: [{
        token: 'string.quoted.double',
        regex: /"/,
        next: 'line',
      }, {
        token: 'constant.character.escape',
        regex: /\\/,
        next: 'escape',
      }, {
        token: 'string.quoted.double',
        regex: /[^\\"]+/,
      }],
      escape: [{
        token: 'constant.character.escape',
        regex: /./,
        next: 'string',
      }],
      line: [{
        token: 'constant.numeric',
        regex: /[\d\.]+/,
      }, {
        token: 'markup.raw',
        regex: /^\s*/,
        next: 'start',
      }, {
        token: 'storage.modifier',
        regex: /\$/,
        next: 'start',
      }, {
        token: 'variable.parameter',
        regex: /[^\(\)"\s]+/,
      }, {
        token: 'storage.modifier',
        regex: /\(/,
        next: 'start',
      }, {
        token: 'storage.modifier',
        regex: /\)/,
      }, {
        token: 'markup.raw',
        regex: /^ */,
        next: 'start',
      }, {
        token: 'string.quoted.double',
        regex: /"/,
        next: 'string',
      }],
    };
  };

  oop.inherits(CirruHighlightRules, TextHighlightRules);

  exports.CirruHighlightRules = CirruHighlightRules;
});

ace.define('ace/mode/folding/coffee', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/folding/fold_mode', 'ace/range'], (acequire, exports, module) => {
  const oop = acequire('../../lib/oop');
  const BaseFoldMode = acequire('./fold_mode').FoldMode;
  const Range = acequire('../../range').Range;

  const FoldMode = exports.FoldMode = function () {};
  oop.inherits(FoldMode, BaseFoldMode);

  (function () {
    this.getFoldWidgetRange = function (session, foldStyle, row) {
      const range = this.indentationBlock(session, row);
      if (range) { return range; }

      const re = /\S/;
      let line = session.getLine(row);
      const startLevel = line.search(re);
      if (startLevel == -1 || line[startLevel] != '#') { return; }

      const startColumn = line.length;
      const maxRow = session.getLength();
      const startRow = row;
      let endRow = row;

      while (++row < maxRow) {
        line = session.getLine(row);
        const level = line.search(re);

        if (level == -1) { continue; }

        if (line[level] != '#') { break; }

        endRow = row;
      }

      if (endRow > startRow) {
        const endColumn = session.getLine(endRow).length;
        return new Range(startRow, startColumn, endRow, endColumn);
      }
    };
    this.getFoldWidget = function (session, foldStyle, row) {
      const line = session.getLine(row);
      const indent = line.search(/\S/);
      const next = session.getLine(row + 1);
      const prev = session.getLine(row - 1);
      const prevIndent = prev.search(/\S/);
      const nextIndent = next.search(/\S/);

      if (indent == -1) {
        session.foldWidgets[row - 1] = prevIndent != -1 && prevIndent < nextIndent ? 'start' : '';
        return '';
      }
      if (prevIndent == -1) {
        if (indent == nextIndent && line[indent] == '#' && next[indent] == '#') {
          session.foldWidgets[row - 1] = '';
          session.foldWidgets[row + 1] = '';
          return 'start';
        }
      } else if (prevIndent == indent && line[indent] == '#' && prev[indent] == '#') {
        if (session.getLine(row - 2).search(/\S/) == -1) {
          session.foldWidgets[row - 1] = 'start';
          session.foldWidgets[row + 1] = '';
          return '';
        }
      }

      if (prevIndent != -1 && prevIndent < indent) { session.foldWidgets[row - 1] = 'start'; } else { session.foldWidgets[row - 1] = ''; }

      if (indent < nextIndent) { return 'start'; }
      return '';
    };
  }).call(FoldMode.prototype);
});

ace.define('ace/mode/cirru', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/cirru_highlight_rules', 'ace/mode/folding/coffee'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextMode = acequire('./text').Mode;
  const CirruHighlightRules = acequire('./cirru_highlight_rules').CirruHighlightRules;
  const CoffeeFoldMode = acequire('./folding/coffee').FoldMode;

  const Mode = function () {
    this.HighlightRules = CirruHighlightRules;
    this.foldingRules = new CoffeeFoldMode();
    this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);

  (function () {
    this.lineCommentStart = '--';
    this.$id = 'ace/mode/cirru';
  }).call(Mode.prototype);

  exports.Mode = Mode;
});
