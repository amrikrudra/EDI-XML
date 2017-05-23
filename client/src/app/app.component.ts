import { Component ,AfterViewInit} from '@angular/core';
import {  AppGlobals} from '../Services/app.global';
import {StorageService} from '../Services/local.storage';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[AppGlobals,StorageService]
})
export class AppComponent  {
  title = 'Node Angular 2 Demo';
  Login:Boolean;
  constructor(private appG: AppGlobals){
    this.Login=  this.appG.GetToken() == undefined ? false :true;
  }
    
    UpdateMaster(IsCheck:boolean){
        this.Login=IsCheck;
    }
}
