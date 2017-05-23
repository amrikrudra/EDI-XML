import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
@Injectable()
export class FreightService {


    constructor(private http: Http) {}

    GetUser(){
        return this.http.get("/api/freight").map(res=>res.json());
    }
   
    SaveUser(data){
         return this.http.post("/api/freight",data).map(res=>res.json());
    }
    UpdateUser(data){
         return this.http.put("/api/freight/"+data.id,data).map(res=>res.json());
    }
     DeleteUser(data){
         return this.http.delete("/api/freight/"+data.id,data).map(res=>res.json());
    }
    
}


  