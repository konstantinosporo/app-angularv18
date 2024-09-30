import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-providers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-providers.component.html',
  styleUrl: './login-providers.component.css'
})
export class LoginProvidersComponent {

  user$: Observable<User | null>;

  private authService = inject(AuthService);

  constructor() {
    this.user$ = this.authService.getCurrentUserObservable();
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
  loginWithGithub() {
    this.authService.loginWithGitHub();
  }
  logout() {
    this.authService.logout();
  }
}
