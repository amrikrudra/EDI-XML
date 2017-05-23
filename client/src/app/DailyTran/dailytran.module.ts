import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { DailyTranComponent} from './dailytran.component';
import {  Ng2PaginationModule} from 'ng2-pagination';
import { DailyTranFilterPipe } from './dailytran.filter';

@NgModule({
  declarations: [
      DailyTranComponent,
      DailyTranFilterPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpModule,
    Ng2PaginationModule,
  
    RouterModule.forRoot([ 
      {path:'dailytran',component:DailyTranComponent}
     
    ]),
    RouterModule
  ],
  providers: [],
 
})
export class DailyTranModule { }
