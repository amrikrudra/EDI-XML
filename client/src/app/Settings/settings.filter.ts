 import {  PipeTransform, Pipe } from '@angular/core';


@Pipe({
    name: 'userFilter'
})
export class SettingsFilterPipe implements PipeTransform {

    transform(value: any[], filterBy: string): any[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((user: any) =>
            user.serverName.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}
