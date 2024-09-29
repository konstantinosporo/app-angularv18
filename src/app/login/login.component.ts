import { Component } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { User, LoginUser } from '../../../lib/definitions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userList: User[] = [
    { name: 'John Doe', email: 'john.doe@example.com', password: 'password123' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', password: 'secret123' },
    { name: 'Alice Johnson', email: 'alice.johnson@example.com', password: '5550123' },
  ];

   onLogin(user: LoginUser): void {
    const { email, password } = user;
    const loginSuccess = this.login(email, password);
    console.log(loginSuccess ? 'Login successful' : 'Login failed');
  }

  login(email: string, password: string): boolean {
    //console.log(`Logging in user with email: ${email}`);
    return this.userList.some(user => user.email === email && user.password === password);
   }

}
