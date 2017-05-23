import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { DashboardComponent } from './dashboard.component';
import { BasicChartReport } from '../chart/chart.base.component';

@NgModule({
  declarations: [
      DashboardComponent,
      BasicChartReport
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpModule,
    ChartsModule,
    RouterModule.forRoot([ 
      {path:'dashboard',component:DashboardComponent}
     
    ]),
    RouterModule
  ],
  providers: [],
 
})
export class DashboardModule { }
