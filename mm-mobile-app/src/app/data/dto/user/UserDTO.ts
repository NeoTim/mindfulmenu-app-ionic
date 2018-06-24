import { IdentifiableDTO } from "../IdentifiableDTO";
import { Transform } from "class-transformer";
import { DateUtil } from "../../../util/DateUtil";
import { AccountStatus } from "../../enum/user/AccountStatus";
import { SubPayService } from "../../enum/user/SubPayService";

export class UserDTO extends IdentifiableDTO {

  firstName: string;

  lastName: string;

  email: string;

  source: string;

  favoriteMealIds: string[];

  emailVerified: boolean;

  @Transform(DateUtil.firebaseFirestoreDateConversion)
  lastLoginDate: Date;

  @Transform(DateUtil.firebaseFirestoreDateConversion)
  lastAutomaticUpdateDate: Date;

  @Transform(DateUtil.firebaseFirestoreDateConversion)
  trialEndDate: Date;

  @Transform(DateUtil.firebaseFirestoreDateConversion)
  lastSubPayDate: Date;

  @Transform(DateUtil.firebaseFirestoreDateConversion)
  subPayExpiresDate: Date;

  subPayService: SubPayService;

  automaticUpdateEnabled: boolean;

  accountStatus: AccountStatus;

  isAdmin: boolean;

  isEnabled: boolean;

}
