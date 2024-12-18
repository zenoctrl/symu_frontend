import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './components/login/login.component';
import { SetupsComponent } from './components/setups/setups.component';
import { SalesComponent } from './components/sales/sales.component';
import { PhoneModelsComponent } from './components/stock/stock-components/phone-models/phone-models.component';
import { StockBatchComponent } from './components/stock/stock-components/stock-batch/stock-batch.component';
import { CaptureInventoryComponent } from './components/stock/stock-components/capture-inventory/capture-inventory.component';
import { ArchiveComponent } from './components/stock/stock-components/archive/archive.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      // {path:"home", component:DashboardComponent},
      { path: 'admin', component: SetupsComponent, canActivate: [AuthGuard] },
      { path: 'sales', component: SalesComponent, canActivate: [AuthGuard] },
      { path: 'stock', component: CaptureInventoryComponent, canActivate: [AuthGuard] },
      { path: 'models', component: PhoneModelsComponent, canActivate: [AuthGuard] },
      { path: 'batches', component: StockBatchComponent, canActivate: [AuthGuard] },
      { path: 'archive', component: ArchiveComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] }
    ],
  },

  { path: 'login', component: LoginComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
