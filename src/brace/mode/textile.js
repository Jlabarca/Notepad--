ace.define('ace/mode/textile_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;

  const TextileHighlightRules = function () {
    this.$rules = {
      start: [
        {
          token(value) {
            if (value.charAt(0) == 'h') { return `markup.heading.${value.charAt(1)}`; }
            return 'markup.heading';
          },
          regex: 'h1|h2|h3|h4|h5|h6|bq|p|bc|pre',
          next: 'blocktag',
        },
        {
          token: 'keyword',
          regex: '[\\*]+|[#]+',
        },
        {
          token: 'text',
          regex: '.+',
        },
      ],
      blocktag: [
        {
          token: 'keyword',
          regex: '\\. ',
          next: 'start',
        },
        {
          token: 'keyword',
          regex: '\\(',
          next: 'blocktagproperties',
        },
      ],
      blocktagproperties: [
        {
          token: 'keyword',
          regex: '\\)',
          next: 'blocktag',
        },
        {
          token: 'string',
          regex: '[a-zA-Z0-9\\-_]+',
        },
        {
          token: 'keyword',
          regex: '#',
        },
      ],
    };
  };

  oop.inherits(TextileHighlightRules, TextHighlightRules);

  exports.TextileHighlightRules = TextileHighlightRules;
});

ace.define('ace/mode/matching_brace_outdent', ['require', 'exports', 'module', 'ace/range'], (acequire, exports, module) => {
  const Range = acequire('../range').Range;

  const MatchingBraceOutdent = function () {};

  (function () {
    this.checkOutdent = function (line, input) {
      if (!/^\s+$/.test(line)) { return false; }

      return /^\s*\}/.test(input);
    };

    this.autoOutdent = function (doc, row) {
      const line = doc.getLine(row);
      const match = line.match(/^(\s*\})/);

      if (!match) return 0;

      const column = match[1].length;
      const openBracePos = doc.findMatchingBracket({ row, column });

      if (!openBracePos || openBracePos.row == row) return 0;

      const indent = this.$getIndent(doc.getLine(openBracePos.row));
      doc.replace(new Range(row, 0, row, column - 1), indent);
    };

    this.$getIndent = function (line) {
      return line.match(/^\s*/)[0];
    };
  }).call(MatchingBraceOutdent.prototype);

  exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

ace.define('ace/mode/textile', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/textile_highlight_rules', 'ace/mode/matching_brace_outdent'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextMode = acequire('./text').Mode;
  const TextileHighlightRules = acequire('./textile_highlight_rules').TextileHighlightRules;
  const MatchingBraceOutdent = acequire('./matching_brace_outdent').MatchingBraceOutdent;

  const Mode = function () {
    this.HighlightRules = TextileHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);

  (function () {
    this.type = 'text';
    this.getNextLineIndent = function (state, line, tab) {
      if (state == 'intag') { return tab; }

      return '';
    };

    this.checkOutdent = function (state, line, input) {
      return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function (state, doc, row) {
      this.$outdent.autoOutdent(doc, row);
    };

    this.$id = 'ace/mode/textile';
  }).call(Mode.prototype);

  exports.Mode = Mode;
});
