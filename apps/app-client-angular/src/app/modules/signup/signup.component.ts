import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastMessageService } from '@libraries/lib-angular';
import { appRoutes, CreateUserRequest, errorsName, SignupRequest, UserEntity } from '@libraries/lib-scrum-toolbox';
import { appIpcs } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../global/services/ipc.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignUpComponent {
  constructor(
    private readonly _ipcService: IpcService,
    private readonly _fb: UntypedFormBuilder,
    private readonly _router: Router,
    private readonly _messageService: ToastMessageService
  ) {}

  formUp = this._fb.group({
    login: ['', [Validators.required, Validators.minLength(4)]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}/),
        Validators.minLength(6),
      ],
    ],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
  });

  redirectToSigin() {
    this._router.navigate([appRoutes.login]);
  }

  async submitForm() {
    if (this.formUp.invalid) {
      return;
    }

    try {
      const request: SignupRequest = {
        username: this.formUp.get('login')?.value,
        firstname: this.formUp.get('firstname')?.value,
        lastname: this.formUp.get('lastname')?.value,
        password: this.formUp.get('password')?.value,
      };

      await this._ipcService.query(appIpcs.signup, request);

      this._messageService.showSuccess('You can now log you in.', 'Account created');

      this._router.navigate([appRoutes.login]);
    } catch (error: any) {
      switch (error.message) {
        case errorsName.usernameAlreadyExists:
          this._messageService.showError('Username already taken', 'Please change your username.');
          break;
        default:
          this._messageService.showError('Account not created', 'Please contact an admin.');
      }
    }
  }
}
