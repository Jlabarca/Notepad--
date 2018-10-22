'use strict';

// This is the main javascript file for the UI. It is included via bundle.js (built with webpack) in index.html

// now the real magic begins - load node modules in the renderer process!
const fs = require('fs'); // file system access directly from browser code!
const remote = require('remote');
const app = remote.require('app');
const dialog = remote.dialog; // access native file picker dialog
const ipcRenderer = require('electron').ipcRenderer; // listen for messages from the main process
const path = require('path');
const Store = require('../main/store.js');

// keep track of the open file and editor
let file, editor;

const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'opened-files',
    defaults: {
        // 800x600 is the default size of our window
        files: []
    }
});
// bind functions to buttons in toolbar
document.querySelector('#save').addEventListener('click', () => save());
document.querySelector('#open').addEventListener('click', () => open());

// bind functions to native menus
ipcRenderer.on('save', save);
ipcRenderer.on('open', (event, file) => open(file));

// bind ace component to the editor div
initAce();

/**
 * Opens a file in the editor
 * @param {String} [fileToOpen] A specific file to open.  Omit to show the open dialog.
 */
function open(fileToOpen) {

    if (fileToOpen) {
        doOpen(fileToOpen);
    } else {
        getFile().then(doOpen)
    }
}

function doOpen(f) {
    file = f;
    fs.readFile(f, 'utf8', (error, contents) => {

        if (error) {
            new Notification('RetroNote', {
                body: `Could not open ${f} : ${error}`
            });
        } else {
            document.getElementById('filename').innerHTML = `${f}`
            app.addRecentDocument(f); // add to the native OS recent documents list in the dock
            // new Notification('RetroNote', { body: `Opened ${f}.` });
            editor.setValue(contents);
            let newFiles = store.get('files')
            if (newFiles.indexOf(f) === -1) {
                newFiles.push(f);
                store.set('files', newFiles);
            }
        }
    });
};
/**
 * Saves the contents of the editor
 */
function save() {
    const write = (file) => {
        fs.writeFile(file, editor.getValue(), 'utf8', (error) => {
            if (error) {
                new Notification('RetroNote', {
                    body: `Could not write to ${file}: ${error}`
                });
            } else {
                new Notification('RetroNote', {
                    body: `Contents written to ${file}.`
                });
            }
        });
    };

    if (file) {
        write(file);
    } else {
        dialog.showSaveDialog({
            title: 'Select Location'
        }, filename => {
            file = filename;
            write(file);
        })
    }
}

/**
 * Prompts the user for a file selection using the electron native file dialog
 * @returns {Promise}
 */
function getFile() {
    return new Promise((resolve, reject) => {
        dialog.showOpenDialog({
            properties: ['openFile']
        }, selectedFile => {
            if (selectedFile && selectedFile[0]) {
                file = selectedFile[0];
                resolve(file);
            }
        });
    });
}

/**
 * Binds the ace component to the editor div
 */
function initAce() {
    // import ace, mode, and theme
    const ace = require('../brace');
    require('../brace/mode/text');
    require('../brace/theme/terminal');
    require('../brace/ext/searchbox');
    require('../brace/ext/keybinding_menu');
    require('../brace/ext/chromevox');
    require('../brace/ext/linking');



    // create the editor
    editor = ace.edit('editor');
    editor.getSession().setMode('ace/mode/text');
    editor.setTheme('ace/theme/terminal');
    let files = store.get('files');
    console.log('files', files);
    if (files.length > 0 && files[files.length - 1] != null) {
        console.log('doOpen', files[files.length - 1]);
        doOpen(files[files.length - 1])
    }
}