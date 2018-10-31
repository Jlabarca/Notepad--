

/* jshint asi: true */

const path = require('path');
const fs = require('fs');
const workers = require('./workers');
const stringifyWorkers = require('./stringify-workers');
const fixRequires = require('./fix-requires');

require('shelljs/global');

const braceroot = path.join(__dirname, '..');
const themedir = path.join(braceroot, 'theme');
const modedir = path.join(braceroot, 'mode');
const extdir = path.join(braceroot, 'ext');
const snippetsdir = path.join(braceroot, 'snippets');
const keybindingdir = path.join(braceroot, 'keybinding');
const workersrcdir = path.join(braceroot, 'workersrc');
const workerdir = path.join(braceroot, 'worker');
const buildroot = path.join(__dirname, 'ace-build');

const aceTag = 'v1.2.9';

+(function updateCleanAndPutInOrder() {
  +(function cloneFreshAndRemoveUnneeded() {
    rm('-rf', buildroot);
    exec(`git clone git://github.com/ajaxorg/ace-builds.git ${buildroot}`);
    exec(`(cd ${buildroot} && git pull && git checkout ${aceTag})`);

    ['demo', 'kitchen-sink', 'src-min', 'src', 'textarea']
      .forEach((dir) => { rm('-rf', path.join(buildroot, dir)); });

    rm(path.join(buildroot, '*'));

    // move src-noconflict files to root after we cleaned it since that is all we need
    mv(path.join(buildroot, 'src-min-noconflict/snippets'), buildroot);
    mv(path.join(buildroot, 'src-noconflict/*'), buildroot);

    rm('-rf', path.join(buildroot, 'src-min-noconflict'));
    rm('-rf', path.join(buildroot, 'src-noconflict'));
  }())


  + (function themes() {
    rm('-rf', themedir);
    mkdir(themedir);

    ls(path.join(buildroot, 'theme-*.js'))
      .forEach((file) => {
        const filename = path.basename(file).slice('theme-'.length);
        mv(file, path.join(themedir, filename));
      });
  }())

  + (function modes() {
    rm('-rf', modedir);
    mkdir(modedir);

    ls(path.join(buildroot, 'mode-*.js'))
      .forEach((file) => {
        const filename = path.basename(file).slice('mode-'.length);
        mv(file, path.join(modedir, filename));
      });
  }())

  + (function exts() {
    rm('-rf', extdir);
    mkdir(extdir);

    ls(path.join(buildroot, 'ext-*.js'))
      .forEach((file) => {
        const filename = path.basename(file).slice('ext-'.length);
        mv(file, path.join(extdir, filename));
      });
  }())

  + (function keybindings() {
    rm('-rf', keybindingdir);
    mkdir(keybindingdir);

    ls(path.join(buildroot, 'keybinding-*.js'))
      .forEach((file) => {
        const filename = path.basename(file).slice('keybinding-'.length);
        mv(file, path.join(keybindingdir, filename));
      });
  }())

  + (function workers() {
    rm('-rf', workersrcdir);
    mkdir(workersrcdir);

    ls(path.join(buildroot, 'worker-*.js'))
      .forEach((file) => {
        const filename = path.basename(file).slice('worker-'.length);
        mv(file, path.join(workersrcdir, filename));
      });
  }());
}())

+ (function requires() {
  function fixAllRequires(dir) {
    ls(path.join(dir, '*.js'))
      .forEach((file) => {
        const src = fs.readFileSync(file, 'utf-8');
        const fixed = fixRequires(src);
        fs.writeFileSync(file, fixed, 'utf-8');
      });
  }

  fixAllRequires(themedir);
  fixAllRequires(modedir);
  fixAllRequires(extdir);
  fixAllRequires(keybindingdir);
  fixAllRequires(workersrcdir);
  fixAllRequires(buildroot);
}())

+ (function snippets() {
  rm('-rf', snippetsdir);
  mkdir(snippetsdir);

  ls(path.join(buildroot, 'snippets/*.js'))
    .forEach((file) => {
      mv(file, path.join(snippetsdir, path.basename(file)));
    });
}())

+ (function injectWorkersIntoModes() {
  ls(path.join(modedir, '*.js'))
    .forEach((file) => {
      const src = fs.readFileSync(file, 'utf-8');
      let fixed = src;
      workers.supported
        .forEach((lang) => {
          fixed = fixed
            .replace(
              `"ace/mode/${lang}_worker"`
              , `require("../worker/${lang}")`,
            );
        });

      fs.writeFileSync(file, fixed, 'utf-8');
    });
}())

+ (function workers() {
  const acesrc = fs.readFileSync(path.join(buildroot, 'ace.js'), 'utf-8');

  let pattern1Count = 2;
  let pattern2Count = 2;
  let pattern3Count = 2;
  let pattern4Count = 1;
  let src = acesrc
    // VERY BRITTLE - may easily break with future ace versions
    // replace mod with mod.id in the following two lines inside
    // WorkerClient  function definition
    //  * workerUrl = config.moduleUrl(mod, "worker");
    //  * module: mod,
    .replace(/(:|\()\s*mod\b/g, (m) => {
      pattern1Count--;
      return `${m}.id`;
    })
    .replace(/createWorker\(workerUrl\)/g, () => {
      pattern2Count--;
      return 'createWorker(workerUrl, mod)';
    })
    .replace(/\$workerBlob\(workerUrl\)/g, () => {
      pattern3Count--;
      return '$workerBlob(workerUrl, mod)';
    })
    .replace(/(var script = )("importScripts\()/g, (_, m1, m2) => {
      pattern4Count--;
      return `${m1}mod.src;${m2}`;
    });

  if (pattern1Count || pattern2Count || pattern3Count || pattern4Count) { throw new Error('Worker initalization code requires manual change!'); }

  src += '\nmodule.exports = window.ace.acequire("ace/ace");';
  fs.writeFileSync(path.join(braceroot, 'index.js'), src, 'utf-8');

  rm('-rf', workerdir);
  mkdir(workerdir);
  stringifyWorkers();
}());
