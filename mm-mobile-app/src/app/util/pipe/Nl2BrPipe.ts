import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nl2br'
})
export class Nl2BrPipe implements PipeTransform {

  constructor() {
  }

  transform(value: string): any {
    if (value) {
      return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    else {
      return value;
    }
  }
}
