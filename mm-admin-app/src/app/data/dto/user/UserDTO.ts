import { IdentifiableDTO } from '../IdentifiableDTO';
import { Transform } from 'class-transformer';
import { DateUtil } from '../../../util/DateUtil';
import { AccountStatus } from '../../enum/user/AccountStatus';

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

  automaticUpdateEnabled: boolean;

  accountStatus: AccountStatus;

  isAdmin: boolean;

  isEnabled: boolean;

}
