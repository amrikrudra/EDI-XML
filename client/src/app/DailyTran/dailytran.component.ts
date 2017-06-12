import {  Component,  EventEmitter,  Output} from '@angular/core';
import {  DailyTranService} from '../../Services/daily.service';
import {  Router,  ActivatedRoute} from '@angular/router';
import {  UUID } from 'angular2-uuid';
import {  Sorter} from '../../Services/app.sort';
import swal from 'sweetalert2';

@Component({
  selector: 'app-dailytran',
  templateUrl: './dailytran.component.html',

  providers: [DailyTranService,Sorter]
})
export class DailyTranComponent {
  oSetting: any;
  Settings: any[];
   prev:number=-1;
   cols:any[]=[
  {
      name:"receiveTime",
      title:"Receive Time",
      sorted:false,
      sortAs:"",
      sortable:true
      
      
    },
    {
      name:"fileName",
      title:"File Name",
      sorted:false,
      sortAs:"",
       sortable:true
    },
    {
      name:"client",
      title:"Client",
      sorted:false,
      sortAs:"",
       sortable:true
    },
    {
      name:"records.length",
      title:"Total/New",
      sorted:false,
      sortAs:"",
       sortable:true
    },
    {
      name:"",
      title:"Action",
      sorted:false,
      sortAs:""
      ,
       sortable:false
    }
   ];
   IsNew:boolean=false;
   selectedRow:number;
   firstNameFilter:string;
   HideCross:boolean=true;
  constructor(private _route: ActivatedRoute, private _router: Router, private userService: DailyTranService,private sortService:Sorter) {
    userService.GetDailyTran().subscribe(m => {
      this.Settings = m;
      this.sortService.direction=1;
        this.sortService.sort(this.cols[0],this.Settings);
    });

  }

  onEdit(obj,i) {
    this.selectedRow=i;
    this.oSetting = Object.assign({}, obj); // obj;

  }
  showNew(data){
    this.IsNew=data;
  }
 getNew(records)
 {
   return records.filter(m=>m.IsNew==true).length;
 }

SortColumn(key)
{
 this.sortService.sort(key,this.Settings);
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
