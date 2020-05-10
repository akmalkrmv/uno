import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameComponent {
  public name = new FormControl('', [Validators.required]);

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router
  ) {}

  public next() {
    this.auth.authorized$.subscribe((current) => {
      const payload = { ...current, name: this.name.value };
      this.api.users.update(payload).then(() => this.router.navigate(['']));
    });
  }
}
