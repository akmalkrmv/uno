import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { NavigationService } from '@services/navigation.service';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameComponent {
  public name = new FormControl('', [Validators.required]);

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: NavigationService
  ) {}

  public next() {
    this.auth.authorized$.subscribe((current) => {
      const payload = { ...current, name: this.name.value };
      this.api.users.update(payload).then(() => this.router.redirectIfShould());
    });
  }
}
