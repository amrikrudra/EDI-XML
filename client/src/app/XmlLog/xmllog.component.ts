import {  Component,  EventEmitter,  Output} from '@angular/core';
import {  XmlLognService} from '../../Services/xmllog.service';
import {  Sorter} from '../../Services/app.sort';
import {  Router,  ActivatedRoute} from '@angular/router';
import {  UUID } from 'angular2-uuid';
import swal from 'sweetalert2';

@Component({
  selector: 'app-xmllog',
  templateUrl: './xmllog.component.html',

  providers: [XmlLognService, Sorter]
})
export class XmlLogComponent {
  oSetting: any;
  Settings: any[];
   prev:number=-1;
     cols:any[]=[
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
      name:"receiveTime",
      title:"Created Time",
      sorted:false,
      sortAs:"",
       sortable:true
    },
    {
      name:"records.length",
      title:"No Of Records",
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
   selectedRow:number;
   firstNameFilter:string;
   HideCross:boolean=true;
  constructor(private _route: ActivatedRoute, private _router: Router, private userService: XmlLognService ,private sortService:Sorter) {
    userService.GetXmlLog().subscribe(m => {
      this.Settings = m;
        this.sortService.sort(this.cols[0],this.Settings);
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
  SortColumn(key)
{
 this.sortService.sort(key,this.Settings);
}
  onRemove()
  {
    
   this. HideCross=true;
    this.firstNameFilter="";
  }

}
