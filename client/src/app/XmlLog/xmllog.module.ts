import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { XmlLogComponent} from './xmllog.component';
import {  Ng2PaginationModule} from 'ng2-pagination';
import { XmlLogFilterPipe } from './xmllog.filter';
import { SweetAlert2Module } from '@toverux/ngsweetalert2';
@NgModule({
  declarations: [
      XmlLogComponent,
      XmlLogFilterPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpModule,
    Ng2PaginationModule,
  SweetAlert2Module,
    RouterModule.forRoot([ 
      {path:'xmllog',component:XmlLogComponent}
     
    ]),
    RouterModule
  ],
  providers: [],
 
})
export class XmlLogModule { }
