import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { UserComponent} from './user.component';
import {  Ng2PaginationModule} from 'ng2-pagination';
import { UserFilterPipe } from './user.filter';

@NgModule({
  declarations: [
      UserComponent,
      UserFilterPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpModule,
    Ng2PaginationModule,
  
    RouterModule.forRoot([ 
      {path:'user',component:UserComponent}
     
    ]),
    RouterModule
  ],
  providers: [],
 
})
export class UserModule { }
