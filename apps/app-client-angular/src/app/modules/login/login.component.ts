import { Component } from '@angular/core';
import { appRoutes } from '@libraries/lib-scrum-toolbox';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  routes = appRoutes;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  
  constructor(
    // private readonly signinService: SigninService,
    private readonly fb: UntypedFormBuilder,
    public readonly router: Router
  ) {}


  async submitForm() {
    if (this.form.invalid) {
      return;
    }

    /* try {
      await this.signinService.signin({
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
      });
    } catch (error) {
      throw new ImpossibleToSigninError();
    }*/
  } 
}
