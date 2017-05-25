import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { AdminsettingComponent} from './Adminsetting.component';
import {  Ng2PaginationModule} from 'ng2-pagination';
import { AdminsettingFilterPipe } from './Adminsetting.filter';

@NgModule({
  declarations: [
      AdminsettingComponent,
      AdminsettingFilterPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpModule,
    Ng2PaginationModule,
  
    RouterModule.forRoot([ 
      {path:'adminsetting',component:AdminsettingComponent}
     
    ]),
    RouterModule
  ],
  providers: [],
 
})
export class AdminsettingdModule { }
