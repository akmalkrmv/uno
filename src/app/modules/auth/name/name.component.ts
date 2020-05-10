import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
export class NameComponent implements OnInit {
  public name = new FormControl('', [Validators.required]);

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  public next() {
    const payload = { ...this.auth.current$.value, name: this.name.value };
    this.api.users.update(payload).then(() => this.router.navigate(['']));
  }
}
