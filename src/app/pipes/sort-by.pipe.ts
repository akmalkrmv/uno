import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class ArraySortPipe implements PipeTransform {
  transform(array: any, field: string, order = 'asc'): any[] {
    if (!array || !Array.isArray(array)) {
      return;
    }

    // no array
    if (array.length <= 1) {
      return array;
    }

    // array with only one item
    if (!field || field === '') {
      if (order === 'asc') {
        return array.sort();
      } else {
        return array.sort().reverse();
      }
    }

    array = array.sort((first: any, second: any) => {
      let firstField = first[field] || 0;
      let secondField = second[field] || 0;

      if (firstField < secondField) {
        return -1;
      } else if (firstField > secondField) {
        return 1;
      } else {
        return 0;
      }
    });

    return order === 'asc' ? array : array.reverse();
  }
}
