import {Injectable} from "@angular/core";
import {Http,Headers} from "@angular/http";
import {Task} from "../DataModel/task"
import "rxjs/add/operator/map";

@Injectable()
export class TaskService{
constructor(private http:Http){
    console.log("Task Service Initialized");
    }

getTasks(){
    return this.http.get("/api/tasks").map(res=>res.json());
}

AddTasks(task:Task){
    return this.http.post("/api/tasks",task).map(res=>res.json());
}
UpdateTask(task:Task){
    var header= new Headers();
    header.append("Content-Type","application/json");
    return this.http.put("/api/tasks/"+task._id,JSON.stringify(task),{headers:header} ).map(res=>res.json());
}
DeleteTask(task:Task){
    return this.http.delete("/api/tasks/"+task._id).map(res=>res.json());
}


}
