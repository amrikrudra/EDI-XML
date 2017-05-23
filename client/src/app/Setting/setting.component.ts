import {  Component,  EventEmitter,  Output} from '@angular/core';
import {  SettingService} from '../../Services/setting.service';
import {  Router,  ActivatedRoute} from '@angular/router';
import {  Valid,  ValidateMe,  ValidateMeRule} from '../shared/app.helper';
import {  UUID} from 'angular2-uuid';
import swal from 'sweetalert2';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
 
  providers: [SettingService]
})
export class SettingComponent {
  oSetting: any;
  Settings: any[];
   selectedRow:number;
   firstNameFilter:string;
   HideCross:boolean=true;
  constructor(private _route: ActivatedRoute, private _router: Router, private settingService: SettingService) {
    settingService.GetSetting().subscribe(m => {
      this.Settings = m;
    });

  }

  onEdit(obj,i) {
    this.selectedRow=i;
    this.oSetting = Object.assign({}, obj); // obj;

  }
  onDel(obj) {
    this.settingService.DeleteSetting(obj).subscribe(m => {
      swal('Success', 'Setting deleted successfully...', 'success');
      this.Settings = m;
      this.onNew();
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
  onNew() {
    this.selectedRow=-1;
    this.oSetting = {
      "id": "",
      "serviceType": '',
      "clientName": "",
      "serverName": "",
      "endPoint": "",
      "userName": "",
      "password": "",
      "interval": 0,
      "status": '',
      "sourceFile": "",
      "dailyLog": "",
      "xmlFile": "",
      "compareFile": '',
      "dailyArchive": 0,
      "xmlHistory": 0
    }
    
    ValidateMe("#SettingForm");

  }
  Save() {
    if (Valid("#SettingForm")) {
      if (this.oSetting.id != "") {
        this.settingService.UpdateSetting(this.oSetting).subscribe(m => {
          swal('Success', 'Setting updated successfully...', 'success');
          this.Settings = m;
          this.onNew();
        });
      } else {
        this.oSetting.id = UUID.UUID();
        this.settingService.SaveSetting(this.oSetting).subscribe(m => {
          swal('Success', 'Setting added successfully...', 'success');
          this.Settings = m;
          this.onNew();
        });
      }
    }
  }


}
