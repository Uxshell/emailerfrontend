import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManagerComponent } from './manager/manager.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
//import {LoginComponent} from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { HeaderComponent } from './shared/components/header/header.component';
import { HeaderComponent } from './core/components/header/header.component';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
//import { RegisterComponent } from './register/register.component';
import {RegisterComponent} from './auth/register/register.component';
import { AlertComponent } from './_alerts/alert/alert.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { PostEmailsComponent } from './modules/components/post-emails/post-emails.component';
import { CustomEmailsComponent } from './modules/components/custom-emails/custom-emails.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { StadisticsComponent } from './modules/components/stadistics/stadistics.component';
import { PieComponent } from './modules/components/widgets/pie/pie.component';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatButtonModule} from '@angular/material/button';
import { ChangePasswordComponent } from './modules/components/change-password/change-password.component';
import { FilterComponent } from './modules/components/filter/filter.component';
import { CardGraphComponent } from './modules/components/widgets/card-graph/card-graph.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ManagerListComponent } from './modules/components/manager-list/manager-list.component';
import { DataService } from './modules/components/stadistics/DataService';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { DateRangeComponent } from './modules/components/post-emails/date-range/date-range.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { DatePipe } from '@angular/common';
import { CustomStatisticsComponent } from './modules/components/custom-statistics/custom-statistics.component';
import { AutomationComponent } from './modules/components/automation/automation.component';
import { ListComponent } from './list/list.component';
import { BlackComponent } from './black/black.component';


 
const appRoutes: Routes = [
  {
    path: '', component: ManagerComponent, children: [{
      path: '',
      component: PostEmailsComponent
    },{
      path: 'custom',
      component: CustomEmailsComponent
    },{
      path: 'statistics',
      component: StadisticsComponent
    },{
      path: 'statisticsCustom',
      component: CustomStatisticsComponent
    },{
      path: 'changePassword',
      component: ChangePasswordComponent
    },{
      path: 'manager',
      component: ManagerListComponent
    },{
      path: 'automation',
      component: AutomationComponent
    },{
      path: 'list',
      component: ListComponent
    },{
      path: 'black',
      component: BlackComponent
    }]
  },
  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StadisticsComponent,
    CustomStatisticsComponent,
    ManagerComponent,
    HeaderComponent,
    RegisterComponent,
    AlertComponent,
    SidebarComponent,
    FooterComponent,
    CustomEmailsComponent,
    PieComponent,
    PostEmailsComponent,
    ChangePasswordComponent,
    FilterComponent,
    CardGraphComponent,
    ManagerListComponent,
    DateRangeComponent,
    AutomationComponent,
    ListComponent,
    BlackComponent,
    
    
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MaterialModule,
    HighchartsChartModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports:[MatDatepickerModule, 
    MatNativeDateModule ],
  providers: [DataService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
