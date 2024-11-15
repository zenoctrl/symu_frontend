import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from 'src/app/components/users/users-components/user-list/user-list.component';
import { Router } from '@angular/router';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { DataService } from 'src/app/services/data.service';

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

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: Router,
    private data: DataService
  ) {
    this.getUser();
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
  ];

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = this.user.roleModel.roleName;
    
    if (!role.toLowerCase().includes('director')) {
      this.sidebarMenu = this.sidebarMenu.filter((menu: sidebarMenu) => !menu.link.includes('admin'));
    }

    if (sessionStorage.getItem('countries') == null) {
      this.getCountries();
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

  logout() {
    sessionStorage.clear();
    this.route.navigate(['/login']);
  }

  getCountries() {
    const endpoint: string = ENVIRONMENT.endpoints.countries.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
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
}
