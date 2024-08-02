import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loading!: boolean; email!: string; password!: string;
  error!: string;

  login() {

  }

  
}
