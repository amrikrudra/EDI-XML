import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
@Injectable()
export class XmlLognService {


    constructor(private http: Http) {}

    GetXmlLog(){
        return this.http.get("/api/xmllog").map(res=>res.json());
    }
   
    SaveXmlLog(data){
         return this.http.post("/api/xmllog",data).map(res=>res.json());
    }
    UpdateXmlLog(data){
         return this.http.put("/api/xmllog/"+data.id,data).map(res=>res.json());
    }
     DeleteXmlLog(data){
         return this.http.delete("/api/xmllog/"+data.id,data).map(res=>res.json());
    }
     Resend(id){
         return this.http.get("/api/xmlresend/"+id).map(res=>res.json());
    }
     ResendB(id){
         return this.http.get("/api/xmlresendb/"+id).map(res=>res.json());
    }
}


  