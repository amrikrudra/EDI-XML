import {  Component,  EventEmitter,  Output} from '@angular/core';
import {  FreightService} from '../../Services/freight.service';
import {  Router,  ActivatedRoute} from '@angular/router';
import {  Sorter} from '../../Services/app.sort';
import {  UUID} from 'angular2-uuid';
import swal from 'sweetalert2';
import {  Valid,  ValidateMe,  ValidateMeRule} from '../shared/app.helper';

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',

  providers: [FreightService,Sorter]
})
export class FreightComponent {
  oSetting: any;
  Settings: any[];
  prev:number=-1;
   cols:any[]=[

  {
      name:"fcode",
      title:"FreightCd",
      sorted:false,
      sortAs:"",
      sortable:true
      
      
    },
    {
      name:"floc",
      title:"Dispatchment Loc",
      sorted:false,
      sortAs:"",
       sortable:true
    },
    {
      name:"ttype",
      title:"TType",
      sorted:false,
      sortAs:"",
       sortable:true
    },
    {
      name:"scode",
      title:"Status Code",
      sorted:false,
      sortAs:"",
       sortable:true
    },
    {
      name:"sdesc",
      title:"Description",
      sorted:false,
      sortAs:""
      ,
       sortable:true
    }
    ,
    {
      name:"shiptype",
      title:"Ship Type",
      sorted:false,
      sortAs:""      ,
      sortable:true
    },

{
      name:"tdirection",
      title:"TDirection",
      sorted:false,
      sortAs:""      ,
      sortable:true
    },

{
      name:"",
      title:"Action",
      sorted:false,
      sortAs:""      ,
      sortable:false
    }



   ];
  selectedRow:number;
  firstNameFilter:string;
  HideCross:boolean=true;
  constructor(private _route: ActivatedRoute, private _router: Router, private userService: FreightService,private sortService:Sorter) {
    userService.GetUser().subscribe(m => {
      this.Settings = m;
    });

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

  onEdit(obj,i) {
    this.selectedRow=i;
    this.oSetting = Object.assign({}, obj); // obj;

  }
  SortColumn(key)
{
  this.sortService.sort(key,this.Settings);
}
  onDel(obj) {
    this.userService.DeleteUser(obj).subscribe(m => {
      swal('Success', 'Freight statuscode deleted successfully...', 'success');
      this.Settings = m;
      this.onNew();
    });

  }
  onNew() {
    this.selectedRow=-1;
    this.oSetting = {
      "id": "",
      "fcode": "",
      "fdesc": "",
      "ttype": "",
      "scode": "",
      "sdesc": "",
      "shipType": "-",
      "tdirection": ""
    }
    ValidateMe("#FreightForm");
  }
  Save() {
    if (Valid("#FreightForm")) {
        if (this.oSetting.id != "") {
          this.userService.UpdateUser(this.oSetting).subscribe(m => {
            swal('Success', 'Freight statuscode updated successfully...', 'success');
            this.Settings = m;
            this.onNew();
          });
        } else {
          this.oSetting.id = UUID.UUID();
          this.userService.SaveUser(this.oSetting).subscribe(m => {
            swal('Success', 'Freight statuscode added successfully...', 'success');
            this.Settings = m;
            this.onNew();
          });
        }
      }

    }


  }
