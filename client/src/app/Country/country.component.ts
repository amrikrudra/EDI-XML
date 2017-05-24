import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';
import {
  CountryService
} from '../../Services/country.service';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  UUID
} from 'angular2-uuid';
import swal from 'sweetalert2';
import {
  FileUploader
} from 'ng2-file-upload';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',

  providers: [CountryService]
})
export class CountryComponent {
  oSetting: any;
  Settings: any[];
  public hasBaseDropZoneOver: boolean = false;
  selectedRow: number;
  firstNameFilter: string;
  HideCross: boolean = true;
  public uploader: FileUploader = new FileUploader({
    url: '/fileupload'
  });
  constructor(private _route: ActivatedRoute, private _router: Router, private userService: CountryService) {
    userService.GetCountry().subscribe(m => {
      this.Settings = m;
    });

  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  onEdit(obj, i) {
    this.selectedRow = i;
    this.oSetting = Object.assign({}, obj); // obj;

  }

  showCross() {

    if (this.firstNameFilter.length > 0)
      this.HideCross = false;
    else
      this.HideCross = true;

  }
  onRemove() {

    this.HideCross = true;
    this.firstNameFilter = "";
  }



}
