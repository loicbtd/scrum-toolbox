import { BaseMyProfileModel } from "./base-my-profile.model";

export class Refresh {
  static readonly type = '[My Profile] Refresh';
  constructor(public myProfile: BaseMyProfileModel) {}
}
