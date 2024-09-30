import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  usersService = inject(UsersService);
  usersFirebaseService = inject(DataService);

   ngOnInit(): void {
    // Fetch users from DataService and update UsersService
    this.usersFirebaseService.getUsers().subscribe(users => {
      this.usersService.users.next(users); 
    });
  }
}
