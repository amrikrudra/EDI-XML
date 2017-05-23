import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
@Injectable()
export class SettingService {


    constructor(private http: Http) {}

    GetSetting(){
        return this.http.get("/api/setting").map(res=>res.json());
    }
   
    SaveSetting(data){
         return this.http.post("/api/setting",data).map(res=>res.json());
    }
    UpdateSetting(data){
         return this.http.put("/api/setting/"+data.id,data).map(res=>res.json());
    }
     DeleteSetting(data){
         return this.http.delete("/api/setting/"+data.id,data).map(res=>res.json());
    }
}


  