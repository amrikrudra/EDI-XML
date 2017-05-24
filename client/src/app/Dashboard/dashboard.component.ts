import { Component } from '@angular/core';
import {  DailyTranService} from '../../Services/daily.service';
import {  UUID } from 'angular2-uuid';
import {  Router,  ActivatedRoute} from '@angular/router';
import {  XmlLognService} from '../../Services/xmllog.service';
import {  Sorter} from '../../Services/app.sort';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
 
  providers:[DailyTranService,Sorter,XmlLognService]
})
export class DashboardComponent {

   TotalItemUsed: any;
    TotalProceduresByClient: any;
    oSetting: any;
      prev:number=-1;
  
  xols:any[]=[


 {
      name:"fileName",
      title:"File Name",
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
    





  ]



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
      name:"records.length",
      title:"No Of Records",
      sorted:false,
      sortAs:"",
       sortable:true
    },
    
   ];
  Dailytrans: any[];
  Xmlhistory:any[];
clientItemList:any[];
    constructor(private userService: DailyTranService,private sortService:Sorter ,private XmlService: XmlLognService )
    {

  userService.GetDailyTran().subscribe(m => {
       this.Dailytrans = m;
        this.sortService.sort(this.cols[0],this.Dailytrans);

});


 XmlService.GetXmlLog().subscribe( h => {
      this.Xmlhistory = h;
        this.sortService.sort(this.cols[0],this.Xmlhistory);
    });

      this.TotalItemUsed= { data: [{ data: [65, 59, 80, 81, 56, 55, 40], label: 2016 }, { data: [28, 48, 40, 19, 86, 27, 90], label: 2016 }], label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };

      this.TotalProceduresByClient=  { data: [{ data: [65, 59, 80, 81, 56, 55, 40], label: 2016 }, { data: [28, 48, 40, 19, 86, 27, 90], label: 2016 }], label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };

      this.clientItemList=[{id:'1',name:'Amrik'}];
}


SortColumn(key)
{
 this.sortService.sort(key,this.Dailytrans);
}

XortColumn(key)
{
 this.sortService.sort(key,this.Xmlhistory);
}







  }

