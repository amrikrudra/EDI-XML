import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
@Injectable()
export class DailyTranService {


    constructor(private http: Http) {}

    GetDailyTran(){
        return this.http.get("/api/dailytran").map(res=>res.json());
    }
   
    SaveDailyTran(data){
         return this.http.post("/api/dailytran",data).map(res=>res.json());
    }
    UpdateDaily(data){
         return this.http.put("/api/dailytran/"+data.id,data).map(res=>res.json());
    }
     DeleteDaily(data){
         return this.http.delete("/api/dailytran/"+data.id,data).map(res=>res.json());
    }
    
}


  