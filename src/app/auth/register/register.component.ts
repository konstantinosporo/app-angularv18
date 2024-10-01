import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheck, heroExclamationTriangle } from '@ng-icons/heroicons/outline';
import { BehaviorSubject } from 'rxjs';
import { RegisterUser, VerificationToken } from '../../../../lib/definitions';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { RegisterFormComponent } from "./register-form/register-form.component";

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

  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly dataService = inject(DataService);
  private readonly http = inject(HttpClient);
  private token: VerificationToken | null = null;

  async onRegister(user: RegisterUser): Promise<void> {
    const { name, email, password } = user;
    const registerSuccess = this.register(name, email, password);
    

    if (registerSuccess) {
      try {
        await this.usersService.addUser(name, email, password);
        await this.authService.register(email, password);
        await this.dataService.generateVerificationToken(email)
          .then((verificationToken) => this.token=verificationToken);
        

        // call the api to send verification email
        this.sendVerificationEmail(email,this.token?.token as string).subscribe({
          next: (response) => {
            console.log("Response:", response); // Log the response here
            this.successMessage$.next('Registration successful! Verification email sent.');
            this.clearMessageAfterDelay(this.successMessage$);
          },
          error: (error) => {
            console.log("Error:", error); // Log the error here
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

  sendVerificationEmail(email: string, token: string) {
    return this.http.post('/api/send-email', {
      to: email,
      subject: 'Email Verification',
      content: `Please click the following link to verify your email: 
                https://app-angularv18.vercel.app/email-verification/?token=${token}`
    });
  }

  clearMessageAfterDelay(message$: BehaviorSubject<string | null>, delay: number = 3000) {
    setTimeout(() => {
      message$.next(null);
    }, delay);
  }

}
