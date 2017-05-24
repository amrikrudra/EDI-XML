export class Sorter {
    direction: number;
    key: string;
    constructor() {
        this.direction = 1;
    }
    sort(key, data) {       
        if (this.key === key) {
            this.direction = this.direction * -1;
        }
        else {
            this.direction = 1;
        }
        this.key = key;
        data.sort((a, b) => {
            if (a[key] != null) {
                if (b[key] != null) {

                    if (a[key].toString().toLowerCase() === b[key].toString().toLowerCase()) {
                        return 0;
                    }
                    else if (a[key].toString().toLowerCase() > b[key].toString().toLowerCase()) {
                        return 1 * this.direction;
                    }
                    else {
                        return -1 * this.direction;
                    }
                }
                else {
                    return 1 * this.direction;
                }
            }
            else {
                return -1 * this.direction;
            }
         
        });
    }
}