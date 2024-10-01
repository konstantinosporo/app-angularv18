import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css'
})
export class EmailVerificationComponent implements OnInit {
  token: string | null = null;
  loading$ = new BehaviorSubject<boolean>(true);
  successMessage: string | null = null;

  constructor(private readonly route: ActivatedRoute, private readonly http: HttpClient) { }
  
   ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.verifyEmail(this.token);
      } else {
        this.loading$.next(false);
      }
    });
  }

   verifyEmail(token: string): void {
    this.http.get(`/api/email-verification?token=${token}`).subscribe({
      next: () => {
        this.successMessage = 'Your email has been successfully verified!';
      },
      error: () => {
        this.successMessage = 'There was an error verifying your email.';
      },
      complete: () => {
        this.loading$.next(false);
      }
    });
  }

}
