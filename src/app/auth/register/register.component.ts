import { Component, inject } from '@angular/core';
import { RegisterFormComponent } from "./register-form/register-form.component";
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheck, heroExclamationTriangle } from '@ng-icons/heroicons/outline';
import { BehaviorSubject } from 'rxjs';
import { RegisterUser } from '../../../../lib/definitions';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';

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

  async onRegister(user: RegisterUser): Promise<void> {
    const { name, email, password } = user;
    const registerSuccess = this.register(name, email, password);

    if (registerSuccess) {
      try {
        await this.usersService.addUser(name, email, password);
        await this.authService.register(email, password);
        this.successMessage$.next('Registration successful!');
        this.clearMessageAfterDelay(this.successMessage$);
        this.errorMessage$.next(null); 
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

  clearMessageAfterDelay(message$: BehaviorSubject<string | null>, delay: number = 3000) {
    setTimeout(() => {
      message$.next(null);
    }, delay);
  }

}
