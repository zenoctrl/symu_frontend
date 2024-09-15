import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts/alerts.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormsComponent } from './forms/forms.component';
import { DemoFlexyModule } from '../demo-flexy-module';
import { GridListComponent } from './grid-list/grid-list.component';
import { MenuComponent } from './menu/menu.component';
import { TabsComponent } from './tabs/tabs.component';
import { ExpansionComponent } from './expansion/expansion.component';
import { ChipsComponent } from './chips/chips.component';
import { ProgressComponent } from './progress/progress.component';
import { FormsModule } from '@angular/forms';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProgressSnipperComponent } from './progress-snipper/progress-snipper.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SliderComponent } from './slider/slider.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { StockComponent } from './stock/stock.component';
import { UserListComponent } from './users/users-components/user-list/user-list.component';
import { UserModalComponent } from './users/users-components/user-modal/user-modal.component';
import { PhoneListComponent } from './stock/stock-components/phone-list/phone-list.component';
import { PhoneModalComponent } from './stock/stock-components/phone-list/phone-modal/phone-modal.component';
import { SetupsComponent } from './setups/setups.component';
import { CountriesComponent } from './setups/setups-components/countries/countries.component';
import { RegionsComponent } from './setups/setups-components/regions/regions.component';
import { BranchesComponent } from './setups/setups-components/branches/branches.component';
import { CountryModalComponent } from './setups/setups-components/countries/country-modal/country-modal.component';
import { BranchModalComponent } from './setups/setups-components/branches/branch-modal/branch-modal.component';
import { RegionModalComponent } from './setups/setups-components/regions/region-modal/region-modal.component';
import { PhoneModelsComponent } from './stock/stock-components/phone-models/phone-models.component';
import { ModelModalComponent } from './stock/stock-components/phone-models/model-modal/model-modal.component';
import { StockStatusComponent } from './stock/stock-components/stock-status/stock-status.component';
import { StatusModalComponent } from './stock/stock-components/stock-status/status-modal/status-modal.component';
import { StockBatchComponent } from './stock/stock-components/stock-batch/stock-batch.component';
import { BatchModalComponent } from './stock/stock-components/stock-batch/batch-modal/batch-modal.component';
import { SalesComponent } from './sales/sales.component';
import { PostedSalesComponent } from './sales/posted-sales/posted-sales.component';
import { AfterSalesComponent } from './sales/after-sales/after-sales.component';
import { DealershipsComponent } from './setups/setups-components/dealerships/dealerships.component';
import { DealershipModalComponent } from './setups/setups-components/dealerships/dealership-modal/dealership-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    ButtonsComponent,
    SlideToggleComponent,
    SliderComponent,
    ToolbarComponent,
    ProgressSnipperComponent,
    SnackbarComponent,
    MenuComponent,
    TabsComponent,
    ExpansionComponent,
    ChipsComponent,
    ProgressComponent,
    FormsComponent,
    AlertsComponent,
    GridListComponent,
    TooltipsComponent,
    FormsModule,
    AfterSalesComponent,
  ],
  exports: [
    AlertsComponent,
    FormsComponent,
    GridListComponent,
    MenuComponent,
    TabsComponent,
    ExpansionComponent,
    ChipsComponent,
    ProgressComponent,
    ToolbarComponent,
    ProgressSnipperComponent,
    SnackbarComponent,
    SliderComponent,
    SlideToggleComponent,
    ButtonsComponent,
  ],
  declarations: [
    LoginComponent,
    UsersComponent,
    StockComponent,
    UserListComponent,
    UserModalComponent,
    PhoneListComponent,
    PhoneModalComponent,
    SetupsComponent,
    CountriesComponent,
    RegionsComponent,
    BranchesComponent,
    CountryModalComponent,
    BranchModalComponent,
    RegionModalComponent,
    PhoneModelsComponent,
    ModelModalComponent,
    StockStatusComponent,
    StatusModalComponent,
    StockBatchComponent,
    BatchModalComponent,
    SalesComponent,
    PostedSalesComponent,
    // AfterSalesComponent,
    DealershipsComponent,
    DealershipModalComponent,
  ],
})
export class ComponentsModule {}
