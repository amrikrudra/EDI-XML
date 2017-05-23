import {Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { StorageService } from './local.storage';

@Injectable()

export class AppGlobals {
   
   constructor(private local:StorageService){}
// use this property for property binding
  TokenName="Access-Token";
  Token:string;
  IsLogin:boolean;

  public isUserLoggedIn:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public setLoginStatus(isLoggedIn){
   this.isUserLoggedIn.next(isLoggedIn);
  }

  SetToken(token:string)
  {
    this.local.add(this.TokenName,token);
  }

  GetToken()
  {
  return  this.local.get(this.TokenName);
  }

  DeleteToken()
  {
    this.local.remove(this.TokenName);
  }
  SetUser(user:any)
  {
    this.local.add("CurrentUser",user);
  }
   GetUser()
  {
  return   this.local.get("CurrentUser");
  }
  
  DeleteUser()
  {
    this.local.remove("CurrentUser");
  }
}