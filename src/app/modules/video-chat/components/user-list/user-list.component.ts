import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  @Input() users: User[] = [];

  constructor(private auth: AuthService, private api: ApiService) {}

  public addToFriends(friendId: string) {
    this.auth.authorized$.subscribe((user) =>
      this.api.users.addToFriends(user.id, friendId)
    );
  }

  public canAddToFriends(freindId: string) {
    const current = this.auth.current;
    if (!current) return false;
    if (current.id === freindId) return false;
    if (!current.friends) return true;
    if (current.friends.includes(freindId)) return false;

    return true;
  }
}
