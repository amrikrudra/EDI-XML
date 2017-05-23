import {  Component,  EventEmitter,  Output} from '@angular/core';
import {  DailyTranService} from '../../Services/daily.service';
import {  Router,  ActivatedRoute} from '@angular/router';
import {  UUID } from 'angular2-uuid';
import swal from 'sweetalert2';

@Component({
  selector: 'app-dailytran',
  templateUrl: './dailytran.component.html',

  providers: [DailyTranService]
})
export class DailyTranComponent {
  oSetting: any;
  Settings: any[];
   selectedRow:number;
   firstNameFilter:string;
   HideCross:boolean=true;
  constructor(private _route: ActivatedRoute, private _router: Router, private userService: DailyTranService) {
    userService.GetDailyTran().subscribe(m => {
      this.Settings = m;
    });

  }

  onEdit(obj,i) {
    this.selectedRow=i;
    this.oSetting = Object.assign({}, obj); // obj;

  }
  showCross()
  {
    
    if(this.firstNameFilter.length>0)
        this. HideCross=false;
        else
        this.HideCross=true;
    
  }
  onRemove()
  {
    
   this. HideCross=true;
    this.firstNameFilter="";
  }


}
