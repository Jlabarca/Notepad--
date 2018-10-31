ace.define('ace/mode/plain_text', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/text_highlight_rules', 'ace/mode/behaviour'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextMode = acequire('./text').Mode;
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;
  const Behaviour = acequire('./behaviour').Behaviour;

  const Mode = function () {
    this.HighlightRules = TextHighlightRules;
    this.$behaviour = new Behaviour();
  };

  oop.inherits(Mode, TextMode);

  (function () {
    this.type = 'text';
    this.getNextLineIndent = function (state, line, tab) {
      return '';
    };
    this.$id = 'ace/mode/plain_text';
  }).call(Mode.prototype);

  exports.Mode = Mode;
});
