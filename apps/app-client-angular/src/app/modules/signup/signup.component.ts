import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { appRoutes, errorsName } from '@libraries/lib-scrum-toolbox';
import { appIpcs } from '@libraries/lib-scrum-toolbox';

import { MessageService } from 'primeng/api';

import { IpcService } from '../../global/services/ipc.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignUpComponent {
  routes = appRoutes;

  form = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required]],
  });

  constructor(
    // private readonly signinService: SigninService,
    private readonly _ipcService: IpcService,
    private readonly fb: FormBuilder,
    public readonly router: Router,
    private messageService: MessageService
  ) {}

  showError(summary_: string, detail_: string) {
    this.messageService.add({severity:'error', summary: summary_, detail: detail_});
  }

  async submitForm() {
    if (this.form.invalid) {
      return;
    }

    try {
      const user = await this._ipcService.query(appIpcs.login, {
        login: this.form.get('login')?.value,
        password: this.form.get('password')?.value,
      });
      console.log(user);
      //TODO le truc dans app.module pour refresh local storage
      //TODO redirect to proper page
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
