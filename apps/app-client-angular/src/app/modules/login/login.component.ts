import { Component } from '@angular/core';
import { appRoutes, errorsName } from '@libraries/lib-scrum-toolbox';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appIpcs, Task, TaskStatus, TaskType, User } from '@libraries/lib-scrum-toolbox';
import { IpcService } from '../../global/services/ipc.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  routes = appRoutes;

  form = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required]],
  });

  constructor(
    // private readonly signinService: SigninService,
    private readonly _ipcService: IpcService,
    private readonly fb: FormBuilder,
    public readonly router: Router
  ) {}

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
      //TODO redirect to proper page
      this.router.navigate([appRoutes.scrumToolbox.root]);
      
    } catch (error: any) {
      //TODO username or password not matching
      switch (error.message) {
        case errorsName.incorrectUsername:
          console.log('INCORRECT USERNAME');
          break;
        case errorsName.incorrectPassword:
          console.log('INCORRECT PASSWORD');
          break;
      }
    }
  }
}
