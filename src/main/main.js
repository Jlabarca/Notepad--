'use strict';

// This is the main file that runs when electron starts.  It sets up the native OS menus and events and launches
// the UI by creating a BrowserWindow.

const {
    app,
    BrowserWindow,
    Tray,
    Menu
} = require('electron');
const path = require('path');
const Store = require('./store.js');

let mainWindow, menu, template;
const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'user-preferences',
    defaults: {
        // 800x600 is the default size of our window
        windowBounds: {
            width: 800,
            height: 600
        }
    }
});
app.on('ready', () => {
    let {
        width,
        height
    } = store.get('windowBounds');

    // create a browser window for the UI
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        frame: false
    });
    mainWindow.on('resize', () => {
        // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
        // the height, width, and x and y coordinates.
        let {
            width,
            height
        } = mainWindow.getBounds();
        // Now that we have them, save them using the `set` method.
        store.set('windowBounds', {
            width,
            height
        });
    });

    mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`);

    // open chrome debugger if --dev is specified
    if (process.argv.indexOf('--dev') !== -1) {
        mainWindow.openDevTools();
    }

    // Configure the native menus. Note that you need to specifically include menu options for common functions
    // such as cut, copy, paste, and quit for the usual shortcut keys to work.
    template = [
        require('./menus/main')(app),
        require('./menus/file')(mainWindow),
        require('./menus/edit'),
        require('./menus/view')(mainWindow)
    ];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Create a tray icon, because we can
    const appIcon = new Tray(path.join(__dirname, '..', 'resources', 'tray.png'));
    appIcon.setToolTip('This is RetroNote!');
    appIcon.setContextMenu(Menu.buildFromTemplate([{
        label: 'Open File...',
        click: () => mainWindow.webContents.send('open')
    }]))
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// handle open from recent files (in the dock)
app.on('open-file', (event, file) => {
    mainWindow.webContents.send('open', file)
});