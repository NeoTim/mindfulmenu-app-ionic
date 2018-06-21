import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replaceEmpty' })
export class ReplaceEmptyPipe implements PipeTransform {

    transform(content: any, replacement: string = '-') {
      if ((content === undefined) || (content === null) || (content === '')) {
        return replacement;
      }
      else {
        return content;
      }
    }
}
