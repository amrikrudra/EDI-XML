import {  Component ,Output,EventEmitter ,AfterViewInit} from '@angular/core';
import {  AppGlobals} from '../../Services/app.global';
import {  Router,  ActivatedRoute} from '@angular/router';
import { correctHeight,  BindAll,Login } from '../shared/app.helper';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',

   providers:[AppGlobals]
})
export class MasterComponent  implements  AfterViewInit {
  title = 'Node Angular 2 Demo';
  URLS:any[];
  CurrentUser:any;
  @Output() LogOut= new EventEmitter<boolean>();
  constructor(private appG: AppGlobals,private _route: ActivatedRoute,
        private _router: Router) {
         
         this.CurrentUser=   this.appG.GetUser();
         if(this.CurrentUser)
         {
             if(this.CurrentUser.role=="superadmin")
             {
                 this.URLS= [
                 
                    {url:'/user',cssClass:'fa fa-users',text:'User Setup'},
                    {url:'/settings',cssClass:'fa fa-wrench',text:'System Setting'},
                  
                    ];
             
             }
            else if(this.CurrentUser.role=="admin")
             {
            this.URLS= [
                    {url:'/dashboard',cssClass:'fa fa-th-large',text:'Dashboard'},
                    {url:'/user',cssClass:'fa fa-users',text:'User Setup'},
                    {url:'/setting',cssClass:'fa fa-wrench',text:'System Setting'},
                    {url:'/freightscode',cssClass:'fa fa-gear',text:'FreightCd Reference'},
                    {url:'/dailytran',cssClass:'fa fa-file-text-o',text:'Daily Log'},
                    {url:'/xmllog',cssClass:'fa fa-file-code-o',text:'XML History-Send Log'},
                    {url:'/country',cssClass:'fa fa-file-code-o',text:'Country Code'}
                    ];
             }
             else if  (this.CurrentUser.role=="view")

             {
                  this.URLS= [
                        {url:'/dashboard',cssClass:'fa fa-th-large',text:'Dashboard'},
                        {url:'/freightscode',cssClass:'fa fa-gear',text:'FreightCd Reference'},
                        {url:'/dailytran',cssClass:'fa fa-file-text-o',text:'Daily Log'},
                        {url:'/xmllog',cssClass:'fa fa-file-code-o',text:'XML History-Send Log'},
                        {url:'/country',cssClass:'fa fa-file-code-o',text:'Country Code'}
                    ];
             }
             else
             
                 
             {
                  this.URLS= [
                        {url:'/dashboard',cssClass:'fa fa-th-large',text:'Dashboard'},
                        {url:'/xmllog',cssClass:'fa fa-file-code-o',text:'XML History-Send Log'},
                    ];
             }
             
         }
        

  }

  SignOut() {
   console.log("Sign Out User");
    this.LogOut.emit(false);
    this.appG.DeleteToken();
    this.appG.DeleteUser();
 
  }
  ngAfterViewInit() {
        setTimeout(() => {
            correctHeight();
            BindAll();
            this._router.navigate(['/dashboard']);
        }, 3000)

    }
}
