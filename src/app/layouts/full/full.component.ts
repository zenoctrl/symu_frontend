import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from 'src/app/components/users/users-components/user-list/user-list.component';
import { Router } from '@angular/router';

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

  constructor(private breakpointObserver: BreakpointObserver, private route: Router) {
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
      link: '/stock',
      icon: 'table',
      menu: 'Stock',
    },
    // {
    //   link: '/users',
    //   icon: 'list',
    //   menu: 'Users',  
    // },
    // {
    //   link: '/shop-outlets',
    //   icon: 'list',
    //   menu: 'Shops',
    // },
    {
      link: '/admin',
      icon: 'list',
      menu: 'Admin',
    },
    // {
    //   link: "/button",
    //   icon: "disc",
    //   menu: "Buttons",
    // },
    // {
    //   link: "/forms",
    //   icon: "layout",
    //   menu: "Forms",
    // },
    // {
    //   link: "/alerts",
    //   icon: "info",
    //   menu: "Alerts",
    // },
    // {
    //   link: "/grid-list",
    //   icon: "file-text",
    //   menu: "Grid List",
    // },
    // {
    //   link: "/menu",
    //   icon: "menu",
    //   menu: "Menus",
    // },
    // {
    //   link: "/table",
    //   icon: "grid",
    //   menu: "Tables",
    // },
    // {
    //   link: "/expansion",
    //   icon: "divide-circle",
    //   menu: "Expansion Panel",
    // },
    // {
    //   link: "/chips",
    //   icon: "award",
    //   menu: "Chips",
    // },
    // {
    //   link: "/tabs",
    //   icon: "list",
    //   menu: "Tabs",
    // },
    // {
    //   link: "/progress",
    //   icon: "bar-chart-2",
    //   menu: "Progress Bar",
    // },
    // {
    //   link: "/toolbar",
    //   icon: "voicemail",
    //   menu: "Toolbar",
    // },
    // {
    //   link: "/progress-snipper",
    //   icon: "loader",
    //   menu: "Progress Snipper",
    // },
    // {
    //   link: "/tooltip",
    //   icon: "bell",
    //   menu: "Tooltip",
    // },
    // {
    //   link: "/snackbar",
    //   icon: "slack",
    //   menu: "Snackbar",
    // },
    // {
    //   link: "/slider",
    //   icon: "sliders",
    //   menu: "Slider",
    // },
    // {
    //   link: "/slide-toggle",
    //   icon: "layers",
    //   menu: "Slide Toggle",
    // },
  ];

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['/login']);
  }
}
