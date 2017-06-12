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
import {
  Sorter
} from '../../Services/app.sort';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',

  providers: [CountryService, Sorter]
})
export class CountryComponent {
  oSetting: any;
  Settings: any[];
  prev: number = -1;
  cols: any[] = [

    {
      name: "COUNTRY",
      title: "COUNTRY",
      sorted: false,
      sortAs: "",
      sortable: true


    },
    {
      name: "UNCODE",
      title: "UNCODE",
      sorted: false,
      sortAs: "",
      sortable: true
    },
    {
      name: "LOCNAME",
      title: "LOCNAME",
      sorted: false,
      sortAs: "",
      sortable: true
    },
    {
      name: "SUBDIV",
      title: "SUBDIV",
      sorted: false,
      sortAs: "",
      sortable: true
    },

    {
      name: "IATACODE",
      title: "IATA CODE",
      sorted: false,
      sortAs: "",
      sortable: true
    }

    ,

    {
      name: "IATANAME",
      title: "IATA NAME",
      sorted: false,
      sortAs: "",
      sortable: true
    }

    ,

    {
      name: "TIMEXONE",
      title: "TIME ZONE",
      sorted: false,
      sortAs: "",
      sortable: true
    },

    {
      name: "PORT",
      title: "PORT",
      sorted: false,
      sortAs: "",
      sortable: true
    },

    {
      name: "AIRPORT",
      title: "AIRPORT",
      sorted: false,
      sortAs: "",
      sortable: true
    },

    {
      name: "RAIL",
      title: "RAIL",
      sorted: false,
      sortAs: "",
      sortable: true
    },

    {
      name: "ROAD",
      title: "ROAD",
      sorted: false,
      sortAs: "",
      sortable: true
    }

    ,

    {
      name: "UNSTANDARD",
      title: "UNSTANDARD",
      sorted: false,
      sortAs: "",
      sortable: true
    },

    {
      name: "LOCALNAME",
      title: "LOCALNAME",
      sorted: false,
      sortAs: "",
      sortable: true
    },

    {
      name: "NONIATA",
      title: "NON IATA",
      sorted: false,
      sortAs: "",
      sortable: true
    }

    ,

    {
      name: "VALIDFROM",
      title: "VALID FROM",
      sorted: false,
      sortAs: "",
      sortable: true
    },

    {
      name: "VALIDTO",
      title: "VALID TO",
      sorted: false,
      sortAs: "",
      sortable: true
    }



  ];





  public hasBaseDropZoneOver: boolean = false;
  selectedRow: number;
  firstNameFilter: string;
  HideCross: boolean = true;
  public uploader: FileUploader = new FileUploader({
    url: '/fileupload'
  });
  constructor(private _route: ActivatedRoute, private _router: Router, private userService: CountryService, private sortService: Sorter) {
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
  SortColumn(key) {
    this.sortService.sort(key, this.Settings);
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
