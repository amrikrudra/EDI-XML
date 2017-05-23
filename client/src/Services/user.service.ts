import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
@Injectable()
export class UserService {


    constructor(private http: Http) {}

    GetUser(){
        return this.http.get("/api/user").map(res=>res.json());
    }
   
    SaveUser(data){
         return this.http.post("/api/user",data).map(res=>res.json());
    }
    UpdateUser(data){
         return this.http.put("/api/user/"+data.id,data).map(res=>res.json());
    }
     DeleteUser(data){
         return this.http.delete("/api/user/"+data.id,data).map(res=>res.json());
    }
    Login(data){
         return this.http.post("/api/login",data).map(res=>res.json());
    }
}


  