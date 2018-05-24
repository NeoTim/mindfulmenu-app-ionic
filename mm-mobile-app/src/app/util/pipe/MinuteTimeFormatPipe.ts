import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as momentDurationPluginInit from 'moment-duration-format';

@Pipe({
  name: 'minuteTimeFormat'
})
export class MinuteTimeFormatPipe implements PipeTransform {

  constructor() {
    momentDurationPluginInit(moment);
  }

  transform(value: number): string {
    if (value) {
      // moment plugin initialization is not compatible with TS (the plugin function above dynamically attaches itself to moment),
      // it would normally complain, but @ts-ignore turns off TS/linter checking for the following line

      // @ts-ignore: TS2339: Property 'format' does not exist on type 'Duration'
      return moment.duration(value, "minutes").format('h [hr] m [min]', { usePlural: false, trim: 'both' });
    }
    else {
      return '-';
    }
  }
}
