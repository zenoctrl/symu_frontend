import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SYMU';

  constructor() {
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        code: 3,
        userFirstName: 'Azron',
        userLastName: 'Otieno',
        userEmail: 'azroneo@gmail.com',
        userPhone: '254769497811',
        userId: 31205063,
        userHudumaNo: null,
        userPassword: 'P@ssword',
        userRoleCode: 2,
        userCompanyCode: 1,
        userBrnCode: null,
        userCountryCode: 1,
        userStatus: 'ACTIVE',
        countryEntity: {
          code: 1,
          companyCode: null,
          countryShortDesc: 'Kenyan Shilling',
          countryName: 'Kenya',
          countryCurrencyCode: 'KES',
          countryCountryCode: '254',
          status: 'ACTIVE',
        },
        branchEntity: null,
        roleModel: {
          code: 2,
          roleName: 'Administrator',
          roleShortDesc: 'Administrator',
          roleDescription: 'Administrator',
          roleStatus: null,
          roleCreatedBy: null,
          roleUpdatedBy: null,
          rolePermissionModelSet: [],
        },
      })
    );
  }

}
