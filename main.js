const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');


const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

let mainWindow;
// app.disableHardwareAcceleration();


// Listen for app to be reading
app.on('ready', function(){
    mainWindow = new BrowserWindow({
        width:1920/1.5,
        height:1080/1.5,
        resizable: false,
        webPreferences: {
            enableRemoteModule:true,
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'mainWindow.html'),
            protocol: 'file:',
            slashes: true
    }));
    // mainWindow.webContents.openDevTools()

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('file-dialog', (event, arg) => {
    const yes = dialog.showOpenDialog({
        properties: ['openDirectory'],
        defaultPath:app.getPath("desktop")
    }).then(file => {
        const filepath = file.filePaths[0].toString()
        console.log('Receieved file path: '+filepath)
        event.reply('filepath', filepath)
    }).catch(err => {
        console.log(err)
    })

})




//Create menu template
const mainMenuTemplate = [

];

