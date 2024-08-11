import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading!: boolean;
  userID!: string;
  password!: string;
  successMessage: any;
  errorMessage: any;

  constructor(private data: DataService, private route: Router) {}

  login() {
    this.loading = true;
    this.errorMessage = null;
    const endpoint: string = `${ENVIRONMENT.endpoints.users.login}?userId=${this.userID}&password=${this.password}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          sessionStorage.setItem('user', JSON.stringify(res.data));
          this.route.navigate(['/stock']);
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        this.loading = false;
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }
}
