import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
@Injectable()
export class CountryService {


    constructor(private http: Http) {}

    GetCountry(){
        return this.http.get("/api/country").map(res=>res.json());
    }
   
    SaveCountry(data){
         return this.http.post("/api/country",data).map(res=>res.json());
    }
    UpdateCountry(data){
         return this.http.put("/api/country/"+data.id,data).map(res=>res.json());
    }
     DeleteCountry(data){
         return this.http.delete("/api/country/"+data.id,data).map(res=>res.json());
    }
    
}


  