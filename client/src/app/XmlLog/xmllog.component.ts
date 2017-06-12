import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';
import {
  XmlLognService
} from '../../Services/xmllog.service';
import {
  Sorter
} from '../../Services/app.sort';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  UUID
} from 'angular2-uuid';
import swal from 'sweetalert2';

@Component({
  selector: 'app-xmllog',
  templateUrl: './xmllog.component.html',

  providers: [XmlLognService, Sorter]
})
export class XmlLogComponent {
  oSetting: any;
  Settings: any[];
  prev: number = -1;
  IsNew:boolean=false;
  cols: any[] = [{

      name: "batchid",
      title: "Batch #",
      sorted: true,
      sortAs: "",
      sortable: true
    },
    {

      name: "fileName",
      title: "File Name",
      sorted: false,
      sortAs: "",
      sortable: true
    },
    {
      name: "client",
      title: "Client",
      sorted: false,
      sortAs: "",
      sortable: true
    },
    {
      name: "receiveTime",
      title: "Created Time",
      sorted: false,
      sortAs: "",
      sortable: true
    },
    {
      name: "records.length",
      title: "No of Records",
      sorted: false,
      sortAs: "",
      sortable: true
    },
    {
      name: "",
      title: "Action",
      sorted: false,
      sortAs: "",
      sortable: false
    }
  ];
  selectedRow: number;
  firstNameFilter: string;
  HideCross: boolean = true;
  constructor(private _route: ActivatedRoute, private _router: Router, private userService: XmlLognService, private sortService: Sorter) {
    userService.GetXmlLog().subscribe(m => {
      this.Settings = m;
      this.sortService.direction = 1;
      this.sortService.sort(this.cols[3], this.Settings);
    });

  }

 getNew(records)
 {
   return records.filter(m=>m.IsNew==true).length;
 }
  onEdit(obj, i) {
    this.selectedRow = i;
    this.oSetting = Object.assign({}, obj); // obj;

  }
  showNew(data){
    this.IsNew=data;
  }
  showCross() {

    if (this.firstNameFilter.length > 0)
      this.HideCross = false;
    else
      this.HideCross = true;

  }
  SortColumn(key) {
    this.sortService.sort(key, this.Settings);
  }
  onRemove() {

    this.HideCross = true;
    this.firstNameFilter = "";
  }

  reSend(id, event) {
   
    this.userService.ResendB(id).subscribe(m => {
      swal('Success', 'XMLs resended successfully..', 'success');
    });


  }
  Single(id, event) {
  
    if (event == "cancel") {
      this.userService.Resend(id).subscribe(m => {
        swal('Success', 'XML resended successfully..', 'success');
      });
    }

  }
}
