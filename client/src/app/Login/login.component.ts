import {  Component ,EventEmitter,Output} from '@angular/core';
import {  AppGlobals} from '../../Services/app.global';
import {  Router,  ActivatedRoute} from '@angular/router';
import  { UserService} from '../../Services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ['./login.css'],
  providers: [AppGlobals,UserService]
})
export class LoginComponent {
  
  LogMessage:string;
   userName:string;
      password:string;
  @Output() CheckLogin= new EventEmitter<boolean>();
  constructor(private appG: AppGlobals, private _route: ActivatedRoute, private _router: Router,private logSer:UserService) {
  
    this.LogMessage="";
  }

  LoginMe() {
    this.logSer.Login({userName:this.userName,password:this.password}).subscribe(m=>{
           if(m.status==true)
           {
              this.appG.SetToken(m.user.userName);
              this.appG.SetUser(m.user);
              this.CheckLogin.emit(true);
           }
           else
           {
              this.LogMessage="Login name or password is invalid..";
           }
    });
    
  }

}
