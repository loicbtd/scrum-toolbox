import { IpcRequestHandlerInterface } from '@libraries/lib-electron-web';
import { appIpcs } from '@libraries/lib-scrum-toolbox';
import { environment } from '../../environments/environment';

export class GetAppVersionHandler implements IpcRequestHandlerInterface {
  channel = appIpcs.getAppVersion;

  handle(): string {
    return environment.version;
  }
}
