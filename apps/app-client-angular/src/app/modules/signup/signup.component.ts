import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastMessageService } from '@libraries/lib-angular';

import { appRoutes, errorsName, User } from '@libraries/lib-scrum-toolbox';
import { appIpcs } from '@libraries/lib-scrum-toolbox';

import { MessageService } from 'primeng/api';

import { IpcService } from '../../global/services/ipc.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignUpComponent {
  constructor(
    private readonly _ipcService: IpcService,
    private readonly fb: FormBuilder,
    public readonly router: Router,
    private messageService: ToastMessageService,
    private messageService_: MessageService
  ) {}

  formUp = this.fb.group({
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
    this.router.navigate([appRoutes.login]);
  }

  async submitForm() {
    if (this.formUp.invalid) {
      return;
    }

    try {
      const user = new User();
      user.username = this.formUp.get('login')?.value;
      user.firstname = this.formUp.get('firstname')?.value;
      user.lastname = this.formUp.get('lastname')?.value;
      user.password = this.formUp.get('password')?.value;
      user.createdAt = new Date();

      await this._ipcService.query(appIpcs.createUser, user);

      this.messageService.showSuccess('You can now log you in.', 'Account created');

      this.router.navigate([appRoutes.login]);

    } catch (error: any) {
      switch (error.message) {
        case errorsName.usernameAlreadyExists:
          this.messageService_.add({
            severity: 'error',
            summary: 'Username already taken',
            detail: 'Please change your username.',
          });
          break;
        default:
          console.log(error.message);
          this.messageService_.add({
            severity: 'error',
            summary: 'Account not created',
            detail: 'Please contact an admin.',
          });
      }
    }
  }
}
