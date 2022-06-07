export class IpcChannels {
  public static readonly common = {
    GET_APP_VERSION: 'GET_APP_VERSION',
    GET_APP_SETTINGS: 'GET_APP_SETTINGS',
    SAVE_APP_SETTINGS: 'SAVE_APP_SETTINGS',
    RESET_SETTINGS: 'RESET_SETTINGS',
    GET_PLATFORM: 'GET_PLATFORM',
    EXIT: 'EXIT',
    LOG: 'LOG',
    ASK_CONFIRMATION_BY_DIALOG: 'ASK_CONFIRMATION_BY_DIALOG',
  };
  public static readonly custom = {
    user: {
      create: 'USER-CREATE',
      update: 'USER-UPDATE',
      delete: 'USER-DELETE',
      retrieveAll: 'USER-RETRIEVE-ALL',
    },
  };
}
