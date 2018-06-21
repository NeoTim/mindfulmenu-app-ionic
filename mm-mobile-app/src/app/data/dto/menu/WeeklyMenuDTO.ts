import { Transform } from 'class-transformer';
import { IdentifiableDTO } from "../IdentifiableDTO";
import { DateUtil } from "../../../util/DateUtil";

export class WeeklyMenuDTO extends IdentifiableDTO {

  weekNumber: number;

  @Transform(DateUtil.firebaseFirestoreDateConversion)
  startDate: Date;

  @Transform(DateUtil.firebaseFirestoreDateConversion)
  endDate: Date;

  @Transform(DateUtil.firebaseFirestoreDateConversion)
  publishDate: Date;

  mealIds: string[];

  imageUrl: string;

  intro: string;

}
