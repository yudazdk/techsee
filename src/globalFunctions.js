export function arraySort(direction, orderProp) {
    if (direction.toLowerCase() === 'asc') {
        return function (a, b) {
            if (a[orderProp].toLocaleLowerCase() < b[orderProp].toLowerCase())
                return -1;
            if (a[orderProp].toLocaleLowerCase() > b[orderProp].toLocaleLowerCase())
                return 1;
            return 0;
        };
    } else {
        return function (a, b) {
            if (a[orderProp].toLocaleLowerCase() > b[orderProp].toLocaleLowerCase())
                return -1;
            if (a[orderProp].toLocaleLowerCase() < b[orderProp].toLocaleLowerCase())
                return 1;
            return 0;
        };
    }
}