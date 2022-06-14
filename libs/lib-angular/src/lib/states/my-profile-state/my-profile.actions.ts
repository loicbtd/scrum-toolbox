import { MyProfileModel } from './my-profile.model';

export class Refresh {
  static readonly type = '[My Profile] Refresh';
  constructor(public profile: MyProfileModel) {}
}
