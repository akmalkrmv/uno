import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { take } from 'rxjs/operators';
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
    this.auth.user$.pipe(take(1)).subscribe((current) => {
      this.api.users.update({ ...current, name: this.name.value }).then(() => {
        this.router.navigate(['']);
      });
    });
  }
}
