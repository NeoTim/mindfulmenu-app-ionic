import { Transform } from 'class-transformer';
import { IdentifiableDTO } from '../IdentifiableDTO';
import { DateUtil } from '../../../util/DateUtil';

export class WeeklyMenuDTO extends IdentifiableDTO {

  weekNumber: number;

  @Transform(DateUtil.firebaseDateConversion)
  startDate: Date;

  @Transform(DateUtil.firebaseDateConversion)
  endDate: Date;

  @Transform(DateUtil.firebaseDateConversion)
  publishDate: Date;

  mealIds: string[];

  imageUrl: string;

}
