import { IdentifiableDTO } from "../IdentifiableDTO";
import { Transform } from "class-transformer";
import { DateUtil } from "../../../util/DateUtil";
import { UserDTO } from "./UserDTO";
import * as _ from 'lodash';

export class UserFDTO extends IdentifiableDTO {

  firstName: string;

  lastName: string;

  email: string;

  favoriteMealIds: string[];

  emailVerified: boolean;

  @Transform(DateUtil.firebaseCloudFunctionDateConversion)
  lastLoginDate: Date;

  @Transform(DateUtil.firebaseCloudFunctionDateConversion)
  lastAutomaticUpdateDate: Date;

  automaticUpdateEnabled: boolean;

  isAdmin: boolean;

  isEnabled: boolean;

  // --

  public static fromDTO(dto: UserDTO): UserFDTO {
    let userFDTO = new UserFDTO();

    const copiedProperties: string[] =
      ['id', 'firstName', 'lastName', 'email', 'favoriteMealIds', 'emailVerified', 'lastLoginDate', 'lastAutomaticUpdateDate', 'automaticUpdateEnabled', 'isAdmin', 'isEnabled'];

    for (let copiedProperty of copiedProperties) {
      if (_.has(dto, copiedProperty)) {
        userFDTO[copiedProperty] = _.cloneDeep(dto[copiedProperty]);
      }
    }

    return userFDTO;
  }

  public static toDTO(userFDTO: UserFDTO): UserDTO {
    let dto = new UserDTO();

    const copiedProperties: string[] =
      ['id', 'firstName', 'lastName', 'email', 'favoriteMealIds', 'emailVerified', 'lastLoginDate', 'lastAutomaticUpdateDate', 'automaticUpdateEnabled', 'isAdmin', 'isEnabled'];

    for (let copiedProperty of copiedProperties) {
      if (_.has(userFDTO, copiedProperty)) {
        dto[copiedProperty] = _.cloneDeep(userFDTO[copiedProperty]);
      }
    }

    return dto;
  }

}
