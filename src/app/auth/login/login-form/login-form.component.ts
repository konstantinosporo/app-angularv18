import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginUser } from '../../../../../lib/definitions';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  @Output() login = new EventEmitter<LoginUser>();

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  handleLogin() {
    //TODO use zod to validate the form data before emmitting the login event
    //TODO connect the login logic with firebase authentication via credentials
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const userToSignIn: LoginUser = { email, password };

    console.log(userToSignIn);

    this.login.emit(userToSignIn); // Emitting the login event 

  }

}
