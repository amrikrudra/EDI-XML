import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { SettingComponent} from './setting.component';
import {  Ng2PaginationModule} from 'ng2-pagination';
import { SettingFilterPipe } from './setting.filter';

@NgModule({
  declarations: [
      SettingComponent,
      SettingFilterPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpModule,
    Ng2PaginationModule,
  
    RouterModule.forRoot([ 
      {path:'setting',component:SettingComponent}
     
    ]),
    RouterModule
  ],
  providers: [],
 
})
export class SettingdModule { }
