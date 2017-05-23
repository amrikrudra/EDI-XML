import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
 
  providers:[]
})
export class DashboardComponent {

   TotalItemUsed: any;
    TotalProceduresByClient: any;
clientItemList:any[];
    constructor()
    {
      this.TotalItemUsed= { data: [{ data: [65, 59, 80, 81, 56, 55, 40], label: 2016 }, { data: [28, 48, 40, 19, 86, 27, 90], label: 2016 }], label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };

      this.TotalProceduresByClient=  { data: [{ data: [65, 59, 80, 81, 56, 55, 40], label: 2016 }, { data: [28, 48, 40, 19, 86, 27, 90], label: 2016 }], label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };

      this.clientItemList=[{id:'1',name:'Amrik'}];
}
  }

