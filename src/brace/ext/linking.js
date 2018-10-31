ace.define('ace/ext/linking', ['require', 'exports', 'module', 'ace/editor', 'ace/config'], (acequire, exports, module) => {
  const Editor = acequire('ace/editor').Editor;

  acequire('../config').defineOptions(Editor.prototype, 'editor', {
    enableLinking: {
      set(val) {
        if (val) {
          this.on('click', onClick);
          this.on('mousemove', onMouseMove);
        } else {
          this.off('click', onClick);
          this.off('mousemove', onMouseMove);
        }
      },
      value: false,
    },
  });

  exports.previousLinkingHover = false;

  function onMouseMove(e) {
    var editor = e.editor;
    const ctrl = e.getAccelKey();

    if (ctrl) {
      var editor = e.editor;
      const docPos = e.getDocumentPosition();
      const session = editor.session;
      const token = session.getTokenAt(docPos.row, docPos.column);

      if (exports.previousLinkingHover && exports.previousLinkingHover != token) {
        editor._emit('linkHoverOut');
      }
      editor._emit('linkHover', { position: docPos, token });
      exports.previousLinkingHover = token;
    } else if (exports.previousLinkingHover) {
      editor._emit('linkHoverOut');
      exports.previousLinkingHover = false;
    }
  }

  function onClick(e) {
    const ctrl = e.getAccelKey();
    const button = e.getButton();

    if (button == 0 && ctrl) {
      const editor = e.editor;
      const docPos = e.getDocumentPosition();
      const session = editor.session;
      const token = session.getTokenAt(docPos.row, docPos.column);

      editor._emit('linkClick', { position: docPos, token });
    }
  }
});
(function () {
  ace.acequire(['ace/ext/linking'], () => {});
}());
