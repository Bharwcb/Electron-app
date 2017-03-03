/*
ELECTRON
*/
const electron = require('electron');
const app_elec = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
require('dotenv').load();
let mainWindow;

// when electron initializes and is ready to create browser windows
app_elec.on('ready', createWindow);

// for all OS's aside from OS X, menu closes last tab closed
app_elec.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// when click on icon
app_elec.on('activiate', () => {
	if (mainWindow === null) {
		createWindow();
	}
})



function createWindow () {
	// create browser window
	mainWindow = new BrowserWindow({
		width: 800, 
		height: 600,
		icon: __dirname + '/assets/images/classy.png'
	});

	// load index.html
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'views', 'index.html'),
		protocol: 'file',
		slashes: true
	}));

	// open devtools for testing
	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}





