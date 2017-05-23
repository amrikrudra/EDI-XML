 import {  PipeTransform, Pipe } from '@angular/core';


@Pipe({
    name: 'userFilter'
})
export class FreightFilterPipe implements PipeTransform {

    transform(value: any[], filterBy: string): any[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((user: any) =>
            user.scode.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}
