import { IdentifiableDTO } from "../IdentifiableDTO";
import { Transform } from "class-transformer";
import { DateUtil } from "../../../util/DateUtil";

export class UserDTO extends IdentifiableDTO {

  firstName: string;

  lastName: string;

  email: string;

  favoriteMealIds: string[];

  emailVerified: boolean;

  @Transform(DateUtil.firebaseDateConversion)
  lastLoginDate: Date;

  @Transform(DateUtil.firebaseDateConversion)
  lastAutomaticUpdateDate: Date;

  automaticUpdateEnabled: boolean;

  isAdmin: boolean;

  isEnabled: boolean;

}
