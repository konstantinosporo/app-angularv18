import { Component, inject } from '@angular/core';
import { RegisterFormComponent } from "./register-form/register-form.component";
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheck, heroExclamationTriangle } from '@ng-icons/heroicons/outline';
import { BehaviorSubject } from 'rxjs';
import { RegisterUser } from '../../../../lib/definitions';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RegisterFormComponent, NgIconComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  viewProviders: [provideIcons({ heroExclamationTriangle, heroCheck })],
})
export class RegisterComponent {
  successMessage$ = new BehaviorSubject<string | null>(null);
  errorMessage$ = new BehaviorSubject<string | null>(null);

  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);


  async onRegister(user: RegisterUser): Promise<void> {
    const { name, email, password } = user;
    const registerSuccess = this.register(name, email, password);

    if (registerSuccess) {
      try {
        await this.usersService.addUser(name, email, password);
        await this.authService.register(email, password);

        // call the api to send verification email
        this.sendVerificationEmail(email).subscribe({
          next: (response) => {
            this.successMessage$.next('Registration successful! Verification email sent.');
            this.clearMessageAfterDelay(this.successMessage$);
          },
          error: (error) => {
            this.errorMessage$.next('Registration successful, but failed to send verification email.');
            this.clearMessageAfterDelay(this.errorMessage$);
          },
          complete: () => {
            console.log('Email sending process completed.');
          }
        });

      } catch (error) {
        if (error instanceof Error) {
          this.errorMessage$.next(`Registration failed. ${error.message}`);
          this.clearMessageAfterDelay(this.errorMessage$);
          this.successMessage$.next(null);
        } else {
          this.errorMessage$.next(`Oops.Something went wrong!.`);
          this.clearMessageAfterDelay(this.errorMessage$);
          this.successMessage$.next(null);
        }
      }
    } else {
      this.errorMessage$.next('Please fill in all required fields.');
      this.clearMessageAfterDelay(this.errorMessage$);
      this.successMessage$.next(null);
    }
  }

  register(name: string, email: string, password: string): boolean {
    // Here you can implement your logic for registration
    console.log(`Registering user with email: ${email}`);
    return true;
  }

  sendVerificationEmail(email: string) {
    return this.http.post('/api/send-email', {
      from: 'no-reply@your-app.com',
      subject: 'Email Verification',
      content: `Please click the following link to verify your email: 
                https://your-app.com/verify-email?email=${email}`
    });
  }

  clearMessageAfterDelay(message$: BehaviorSubject<string | null>, delay: number = 3000) {
    setTimeout(() => {
      message$.next(null);
    }, delay);
  }

}
