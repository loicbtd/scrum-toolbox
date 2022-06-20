import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, ToastMessageService } from '@libraries/lib-angular';
import { appRoutes, errorsName, User } from '@libraries/lib-scrum-toolbox';
import { appIpcs } from '@libraries/lib-scrum-toolbox';
import { MyProfileModel } from '../../global/models/my-profile.model';
import { IpcService } from '../../global/services/ipc.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required]],
  });

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly _ipcService: IpcService,
    public readonly _router: Router,
    private readonly _messageService: ToastMessageService,
    private readonly _authenticationService: AuthenticationService
  ) {}

  async redirectToSignup() {
    await this._router.navigate([appRoutes.signup]);
  }

  async submitForm() {
    if (this.form.invalid) {
      return;
    }

    try {
      const user = await this._ipcService.query<User>(appIpcs.login, {
        login: this.form.get('login')?.value,
        password: this.form.get('password')?.value,
      });

      await this._authenticationService.login<MyProfileModel>({ isLoggedIn: true, user: user }, [
        appRoutes.scrumToolbox.root,
      ]);
    } catch (error: any) {
      switch (error.message) {
        case errorsName.incorrectUsername:
          this._messageService.showError('Wrong Username', 'Username cannot be found, please create an account.');
          break;
        case errorsName.incorrectPassword:
          this._messageService.showError('Wrong Password', 'Please check your passsword and username.');
          break;
        case errorsName.userNotActivated:
          this._messageService.showError(
            'Your account is deactivated. Please contact an administrator.',
            'Account deactivated'
          );
          break;
      }
    }
  }
}
