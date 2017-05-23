import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { CountryComponent} from './country.component';
import {  Ng2PaginationModule} from 'ng2-pagination';
import { CountryFilterPipe } from './country.filter';

@NgModule({
  declarations: [
      CountryComponent,
      CountryFilterPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpModule,
    Ng2PaginationModule,
  
    RouterModule.forRoot([ 
      {path:'country',component:CountryComponent}
     
    ]),
    RouterModule
  ],
  providers: [],
 
})
export class CountryModule { }
