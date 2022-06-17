import { BaseMyProfileModel } from './base-my-profile.model';

export class Refresh {
  static readonly type = '[My Profile] Refresh';
  constructor(public myProfile: BaseMyProfileModel) {}
}

export class Login {
  static readonly type = '[My Profile] Login';
}

export class Logout {
  static readonly type = '[My Profile] Logout';
}
