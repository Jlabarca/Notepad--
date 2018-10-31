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

ace.define('ace/mode/space_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;

  const SpaceHighlightRules = function () {
    this.$rules = {
      start: [
        {
          token: 'empty_line',
          regex: / */,
          next: 'key',
        },
        {
          token: 'empty_line',
          regex: /$/,
          next: 'key',
        },
      ],
      key: [
        {
          token: 'variable',
          regex: /\S+/,
        },
        {
          token: 'empty_line',
          regex: /$/,
          next: 'start',
        }, {
          token: 'keyword.operator',
          regex: / /,
          next: 'value',
        },
      ],
      value: [
        {
          token: 'keyword.operator',
          regex: /$/,
          next: 'start',
        },
        {
          token: 'string',
          regex: /[^$]/,
        },
      ],
    };
  };

  oop.inherits(SpaceHighlightRules, TextHighlightRules);

  exports.SpaceHighlightRules = SpaceHighlightRules;
});

ace.define('ace/mode/space', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/folding/coffee', 'ace/mode/space_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextMode = acequire('./text').Mode;
  const FoldMode = acequire('./folding/coffee').FoldMode;
  const SpaceHighlightRules = acequire('./space_highlight_rules').SpaceHighlightRules;
  const Mode = function () {
    this.HighlightRules = SpaceHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);
  (function () {
    this.$id = 'ace/mode/space';
  }).call(Mode.prototype);
  exports.Mode = Mode;
});
