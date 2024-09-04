import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setups',
  templateUrl: './setups.component.html',
  styleUrls: ['./setups.component.scss']
})
export class SetupsComponent {

  user: any;

  constructor(private route: Router) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = this.user.roleModel.roleName;
    if (!role.toLowerCase().includes('director')) {
      sessionStorage.clear();
      this.route.navigate(['/']);
    }
  }

}
