import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UsersComponent } from './core/users/users.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "users", component: UsersComponent },
  { path:'email-verification', component: EmailVerificationComponent},
  { path: "**", component: NotFoundComponent }
];
