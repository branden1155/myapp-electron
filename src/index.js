const { app, BrowserWindow, Menu, Notification, shell, ipcMain } = require('electron');
const path = require('path');

// This creates the default browser window with file path of preload.js
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      //Added node integration
      nodeIntegration: true
    },
  });

  // this then loads the home page which is hosted under index.html
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Delete the slash to enable devTools on re-open
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ----- CODE ADDED FOR THIS ASSIGNMENT ------

// Menu list 
const menuList = [
  // List that show links, and when clicked on transfer to a browser with the url included.
  {
    label: 'Links',
    submenu: [
      {
        label: 'My GitHub',
        click: async () => {
          await shell.openExternal('https://github.com/branden1155')
        }
      },
      {
        label: 'Project Assignment',
        click: async () => {
          await shell.openExternal('https://online.fullsail.edu/class_sections/176065/modules/614234/activities/3566974')
        }
      },
    ]
  },
  // Menu that opens a new window with for the google browser.
  {
    label: 'Google Browser',
    submenu: [
      {
        label: 'Open Google',
        click: async () => {
          const googleWindow = new BrowserWindow({
            height: 400,
            width: 600,
            show: false,
          })
          googleWindow.loadURL('https://www.google.com');
          googleWindow.once('ready-to-show', () => googleWindow.show());
        }
      }
    ]
  },
  // Menu with a exit button that closes the application on click
  {
    label: 'Exit Application',
    click: () =>  app.quit()
  },
];
// This builds the menu from 'template' that replaces the default menu set in place.
const menu = Menu.buildFromTemplate(menuList);
// Sets the menu created above to the application.
Menu.setApplicationMenu(menu);

// This is a function that displays the notification when a button from index.js is clicked.
function showNotification(title, body) {
  const notification = new Notification({
    title: title,
    body: body,
  });

  notification.show();
};

// Listen for the notification event, transfered through the preload, and index.js
ipcMain.on('show-notification', (event, title, body) => {
  showNotification(title, body);
});

//This function creates a new browserWindow directed towards the new-window.html page
function createNewWindow() {
  const newWindow = new BrowserWindow({
    preload: path.join(__dirname, 'new-window.html'),
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  newWindow.loadFile(path.join(__dirname, 'new-window.html'));
}

// Listen for the new window event, transfered through the preload, and index.js
ipcMain.handle('create-new-window', () => {
  createNewWindow();
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}