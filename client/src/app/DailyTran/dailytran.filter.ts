 import {  PipeTransform, Pipe } from '@angular/core';


@Pipe({
    name: 'userFilter'
})
export class DailyTranFilterPipe implements PipeTransform {

    transform(value: any[], filterBy: string): any[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((user: any) =>
            user.receiveTime.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}
