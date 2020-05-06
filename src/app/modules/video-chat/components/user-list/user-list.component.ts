import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @Input() users: User[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if(data && data.users) {
      this.users = data.users;
    }
  }

  ngOnInit(): void {}
}
