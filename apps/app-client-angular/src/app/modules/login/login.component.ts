import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyProfileService } from '@libraries/lib-angular';
import { appRoutes, errorsName, User } from '@libraries/lib-scrum-toolbox';
import { appIpcs } from '@libraries/lib-scrum-toolbox';
import { MessageService } from 'primeng/api';
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
    public readonly router: Router,
    private readonly messageService: MessageService,
    private readonly _myProfileService: MyProfileService
  ) {}

  showError(summary_: string, detail_: string) {
    this.messageService.add({ severity: 'error', summary: summary_, detail: detail_ });
  }

  redirectToSignup() {
    this.router.navigate([appRoutes.signup]);
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
      console.log(user);

      await this._myProfileService.refresh<MyProfileModel>({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      });

      this.router.navigate([appRoutes.scrumToolbox.root]);
    } catch (error: any) {
      switch (error.message) {
        case errorsName.incorrectUsername:
          this.showError('Wrong Username', 'Username cannot be found, please create an account.');
          break;
        case errorsName.incorrectPassword:
          this.showError('Wrong Password', 'Please check your passsword and username.');
          break;
      }
    }
  }
}
