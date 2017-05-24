import {  Component,  EventEmitter,  Output} from '@angular/core';
import {  UserService} from '../../Services/user.service';
import {  Sorter} from '../../Services/app.sort';
import {  ValidateMe,  Valid} from '../shared/app.helper';
import {  Router,  ActivatedRoute} from '@angular/router';
import {  UUID} from 'angular2-uuid';
import swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',

  providers: [UserService,Sorter]
})
export class UserComponent {
  oSetting: any;
  Settings: any[];
  cols:any[]=[
    {
      name:"userName",
      title:"Login Name",
      sorted:true,
      sortAs:"fa-sort-alpha-asc"
    },
    {
      name:"firstName",
      title:"First Name",
      sorted:true,
      sortAs:"fa-sort-alpha-desc"
    },
    {
      name:"lastName",
      title:"Last Name",
      sorted:true,
      sortAs:"fa-sort-asc"
    },
    {
      name:"role",
      title:"Role",
      sorted:true,
      sortAs:"fa-sort-desc"
    },
    {
      name:"status",
      title:"Status",
      sorted:false,
      sortAs:""
    }
    ,
    {
      name:"",
      title:"Action",
      sorted:false,
      sortAs:""
    }
  ];
  selectedRow: number;
  firstNameFilter: string;
  HideCross: boolean = true;

  constructor(private _route: ActivatedRoute, private _router: Router, private userService: UserService,private sortService:Sorter) {
    userService.GetUser().subscribe(m => {
      this.Settings = m;
    });

  }
  showCross() {

    if (this.firstNameFilter.length > 0)
      this.HideCross = false;
    else
      this.HideCross = true;

  }

SortColumn(key)
{
  this.sortService.sort(key,this.Settings);
}

  onRemove() {
    this.HideCross = true;
    this.firstNameFilter = "";
  }
  onEdit(obj, i) {
    this.selectedRow = i;
    this.oSetting = Object.assign({}, obj); // obj;

  }
  onDel(obj) {
    this.userService.DeleteUser(obj).subscribe(m => {
      swal('Success', 'User deleted successfully...', 'success');
      this.Settings = m;
      this.onNew();
    });

  }
  onNew() {
    this.selectedRow = -1;
    this.oSetting = {
      "id": "",
      "role": 0,
      "firstName": "",
      "lastName": "",
      "userName": "",
      "password": "",
      "status": true
    }
    ValidateMe("#myForm");
  }
  Save() {

    if (Valid("#myForm")) {

      if (this.oSetting.id != "") {
        this.userService.UpdateUser(this.oSetting).subscribe(m => {
          swal('Success', 'User updated successfully...', 'success');
          this.Settings = m;
          this.onNew();
        });
      } else {
        this.oSetting.id = UUID.UUID();
        this.userService.SaveUser(this.oSetting).subscribe(m => {
          swal('Success', 'User added successfully...', 'success');
          this.Settings = m;
          this.onNew();
        });
      }
    }

  }


}
