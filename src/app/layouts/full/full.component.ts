import { Component, HostListener  } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Country } from 'src/app/components/setups/setups-components/countries/countries.component';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss'],
})
export class FullComponent {
  search: boolean = false;
  year: number = new Date().getFullYear();
  user: any;
  loading!: boolean;
  password!: string;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  countries: Country[] = [];
  isDirector!: boolean;
  countryCode!: number;

  private timeoutId: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: Router,
    private data: DataService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.getUser();
    this.resetTimer();
  }

  routerActive: string = 'activelink';

  sidebarMenu: sidebarMenu[] = [
    // {
    //   link: '/home',
    //   icon: 'home',
    //   menu: 'Dashboard',
    // },
    {
      link: '/sales',
      icon: 'layers',
      menu: 'Sales',
    },
    {
      link: '/stock',
      icon: 'table',
      menu: 'Stock',
    },
    {
      link: '/models',
      icon: 'smartphone',
      menu: 'Models',
    },
    {
      link: '/batches',
      icon: 'box',
      menu: 'Batches',
    },
    {
      link: '/archive',
      icon: 'file',
      menu: 'Archive',
    },
    {
      link: '/admin',
      icon: 'settings',
      menu: 'Admin',
    },
    {
      link: '/users',
      icon: 'users',
      menu: 'Users',
    }
  ];

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = this.user.roleModel.roleName;
    this.isDirector = role.toLowerCase().includes('director');
    this.countryCode = this.user.userCountryCode;

    if (!this.isDirector) {
      this.sidebarMenu = this.sidebarMenu.filter(
        (menu: sidebarMenu) =>
          !menu.link.includes('admin') && !menu.link.includes('users')
      );
    }

    if (role.toLowerCase().includes('sales executive')) {
      this.sidebarMenu = this.sidebarMenu.filter(
        (menu: sidebarMenu) =>
          menu.link.includes('sales') || menu.link.includes('stock')
      );
    }

    if (sessionStorage.getItem('countries') == null) {
      this.getCountries();
    } else {
      this.countries = JSON.parse(sessionStorage.getItem('countries') || '[]');
    }

    if (sessionStorage.getItem('regions') == null) {
      this.getRegions();
    }

    if (sessionStorage.getItem('branches') == null) {
      this.getBranches();
    }

    if (sessionStorage.getItem('stock-batches') == null) {
      this.getAllStockBatch();
    }

    if (sessionStorage.getItem('models') == null) {
      this.getDeviceModels();
    }

    if (sessionStorage.getItem('stock-statuses') == null) {
      this.getStockStatuses();
    }
  }

  selectCountry() {
    this.user.userCountryCode = Number(this.countryCode);
    sessionStorage.setItem('user', JSON.stringify(this.user));
    window.location.reload();
  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['/login']);
  }

  getCountries() {
    const endpoint: string = ENVIRONMENT.endpoints.countries.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.countries = res.data;
          sessionStorage.setItem('countries', JSON.stringify(res.data));
        } else {
          this.getCountries();
        }
      },
      (error: any) => {
        this.getCountries();
      }
    );
  }

  getRegions() {
    const endpoint: string = `${ENVIRONMENT.endpoints.regions.getAll}?companyCode=${this.user.userCompanyCode}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          sessionStorage.setItem('regions', JSON.stringify(res.data));
        } else {
          this.getRegions();
        }
      },
      (error: any) => {
        this.getRegions();
      }
    );
  }

  getBranches() {
    const endpoint: string = `${ENVIRONMENT.endpoints.branches.getAll}?companyCode=${this.user.userCompanyCode}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          sessionStorage.setItem('branches', JSON.stringify(res.data));
        } else {
          this.getBranches();
        }
      },
      (error: any) => {
        this.getBranches();
      }
    );
  }

  getAllStockBatch() {
    const endpoint: string = ENVIRONMENT.endpoints.stock.batch.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          sessionStorage.setItem('stock-batches', JSON.stringify(res.data));
        } else {
          this.getAllStockBatch();
        }
      },
      (error: any) => {
        this.getAllStockBatch();
      }
    );
  }

  getDeviceModels() {
    const endpoint: string = ENVIRONMENT.endpoints.phoneModels.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          sessionStorage.setItem('models', JSON.stringify(res.data));
        } else {
          this.getDeviceModels();
        }
      },
      (error: any) => {
        this.getDeviceModels();
      }
    );
  }

  getStockStatuses() {
    const endpoint: string = ENVIRONMENT.endpoints.stock.status.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          sessionStorage.setItem('stock-statuses', JSON.stringify(res.data));
        } else {
          this.getStockStatuses();
        }
      },
      (error: any) => {
        this.getStockStatuses();
      }
    );
  }

  togglePasswordForm(event: Event, displayProperty: string = 'none') {
    event.stopPropagation();
    const form = document.querySelector('#password-form') as HTMLDivElement;
    form.style.display = displayProperty;

    const toggleButton = document.querySelector('#change-password-btn') as HTMLAnchorElement;
    toggleButton.style.display = displayProperty == 'block' ? 'none' : 'block';

    this.password = '';
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  updatePassword() {
      const payload = {
        code: this.user.code,
        userFirstName: this.user.userFirstName,
        userLastName: this.user.userLastName,
        userEmail: this.user.userEmail,
        userPhone: this.user.userPhone,
        userId: this.user.userId,
        userPassword: this.password,
        userRoleCode: this.user.userRoleCode,
        userCompanyCode: this.user.userCompanyCode,
        userClusterCode: this.user.userClusterCode,
        userBrnCode: this.user.userBrnCode,
        userRegionCode: this.user.userRegionCode,
        userCountryCode: this.user.userCountryCode,
        userStatus: this.user.userStatus,
      };
      this.loading = true;
      const endpoint: string = ENVIRONMENT.endpoints.users.update;
      this.data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
        (res: any) => {
          this.loading = false;
          let message;
          if (res.statusCode == 0) {
            const form = document.querySelector('#password-form') as HTMLDivElement;
            form.style.display = 'none';

            const toggleButton = document.querySelector('#change-password-btn') as HTMLAnchorElement;
            toggleButton.style.display = 'block';

            this.password = '';
            message = 'Password changed successfully';
          } else {
            message = res.message;
          }
          this.openSnackBar(message, 'Close');
        },
        (error: any) => {
          this.loading = false;
          let message;
          if (error.error.message !== undefined) {
            message = error.error.message;
          } else {
            message = 'Internal server error. Please try again.';
          }
          this.openSnackBar(message, 'Close');
        }
      );
    }

    @HostListener('keydown', ['$event'])
    @HostListener('mouseover', ['$event'])
    @HostListener('click', ['$event'])
    resetTimer(event?: Event) {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.openSnackBar('You were logged out due to inactivity.', 'Close');
        this.dialog.closeAll();
        this.logout();
      }, 60 * 60 * 1000);
    }

}
