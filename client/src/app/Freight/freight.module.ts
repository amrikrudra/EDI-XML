import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { FreightComponent} from './freight.component';
import {  Ng2PaginationModule} from 'ng2-pagination';
import { FreightFilterPipe } from './freight.filter';

@NgModule({
  declarations: [
      FreightComponent,
      FreightFilterPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpModule,
    Ng2PaginationModule,
  
    RouterModule.forRoot([ 
      {path:'freightscode',component:FreightComponent}
     
    ]),
    RouterModule
  ],
  providers: [],
 
})
export class FreightModule { }
