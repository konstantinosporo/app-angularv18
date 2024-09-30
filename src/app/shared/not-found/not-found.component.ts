import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [NgIconComponent, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
  viewProviders: [provideIcons({ heroExclamationTriangle })],
})
export class NotFoundComponent {

}
