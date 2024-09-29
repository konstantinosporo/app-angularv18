import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterUser } from '../../../../lib/definitions';
import { BehaviorSubject } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangle } from '@ng-icons/heroicons/outline';
@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent
  ],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  viewProviders: [provideIcons({ heroExclamationTriangle })],
})
export class RegisterFormComponent {
  errorMessageClient$ = new BehaviorSubject<string | null>(null);

  @Output() register = new EventEmitter<RegisterUser>();

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  handleRegister() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;

      // Check if passwords match
      if (password === this.registerForm.value.confirmPassword) {
        this.register.emit({ name, email, password } as RegisterUser); // Emit the RegisterUser object
      } else {
        this.errorMessageClient$.next('Passwords do not match!');
        this.clearMessageAfterDelay(this.errorMessageClient$);
      }
    } else {
      this.errorMessageClient$.next('Form is invalid. Please fill in all required fields.');
      this.clearMessageAfterDelay(this.errorMessageClient$);
    }
  }

  clearMessageAfterDelay(message$: BehaviorSubject<string | null>, delay: number = 3000) {
    setTimeout(() => {
      message$.next(null);
    }, delay);
  }

}
