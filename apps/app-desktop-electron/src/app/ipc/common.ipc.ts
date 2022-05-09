import { app, dialog, ipcMain } from 'electron';
import { IpcChannels } from '@libraries/lib-common';
import { environment } from '../../environments/environment';
import { IpcResponseModel } from '@libraries/lib-common';

export class CommonIpc {
  static bootstrap(): Electron.IpcMain {
    return ipcMain;
  }
}

ipcMain.on(IpcChannels.common.GET_APP_VERSION, (event) => {
  const ipcResponse: IpcResponseModel<string> = { data: environment.version };

  event.sender.send(IpcChannels.common.GET_APP_VERSION, ipcResponse);
});

ipcMain.on(IpcChannels.common.GET_PLATFORM, (event) => {
  const ipcResponse: IpcResponseModel<string> = { data: process.platform.toString() };
  event.sender.send(IpcChannels.common.GET_PLATFORM, ipcResponse);
});

ipcMain.on(IpcChannels.common.EXIT, (_event, code) => {
  app.exit(code);
});

ipcMain.on(IpcChannels.common.ASK_CONFIRMATION_BY_DIALOG, async (event, message: string) => {
  const ipcResponse = new IpcResponseModel<boolean>();

  try {
    ipcResponse.data =
      (
        await dialog.showMessageBox({
          title: 'Confirmation',
          message: message,
          buttons: ['No', 'Yes'],
        })
      ).response === 1;
  } catch (error) {
    ipcResponse.data = error.message;
  }

  event.sender.send(IpcChannels.common.ASK_CONFIRMATION_BY_DIALOG, ipcResponse);
});
