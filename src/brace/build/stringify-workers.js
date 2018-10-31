

let path = require('path'),
  uglify = require('uglify-js'),
  fs = require('fs'),
  workers = require('./workers');
function minify(code) {
  let compressor = uglify.Compressor(),
    ast = uglify.parse(code);

  ast.figure_out_scope();
  return ast.transform(compressor).print_to_string();
}

module.exports = function () {
  // 'php', 'xquery' not supported since they cannot be inlined even when minified before stringify
  workers.supported
    .forEach((worker) => {
      const filename = `${worker.toLowerCase()}.js`;
      const file = path.join(__dirname, '..', 'workersrc', filename);
      const src = fs.readFileSync(file, 'utf-8');

      const dst = path.join(__dirname, '..', 'worker', filename);
      const stringified = JSON.stringify(minify(src));

      // need a String object here so we can attach extra props like src
      const code = `module.exports.id = 'ace/mode/${worker}_worker';\n`
                + `module.exports.src = ${stringified};`;

      fs.writeFileSync(dst, code, 'utf-8');
    });
};

