import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tittlecase'
})
export class TittlecasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value; // Return null, undefined, or empty string as is

    return value.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

}
