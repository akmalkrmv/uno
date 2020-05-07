import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@models/index';

@Component({
  templateUrl: './members-dialog.component.html',
  styleUrls: ['./members-dialog.component.scss'],
})
export class MembersDialogComponent {
  @Input() users: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<MembersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.users) {
      this.users = data.users;
    }
  }
}
