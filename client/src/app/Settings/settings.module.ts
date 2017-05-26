import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { SettingsComponent} from './settings.component';
import {  Ng2PaginationModule} from 'ng2-pagination';
import { SettingsFilterPipe } from './settings.filter';

@NgModule({
  declarations: [
      SettingsComponent,
      SettingsFilterPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpModule,
    Ng2PaginationModule,
  
    RouterModule.forRoot([ 
      {path:'settings',component:SettingsComponent}
     
    ]),
    RouterModule
  ],
  providers: [],
 
})
export class SettingsdModule { }
