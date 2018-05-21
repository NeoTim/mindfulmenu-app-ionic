
export class UserDTO {

  firstName: string;

  lastName: string;

  email: string;

  favoriteMealIds: string[];

  emailVerified: boolean;

  lastLoginDate: Date;

  lastAutomaticUpdateDate: Date;

  automaticUpdateEnabled: boolean;

  isAdmin: boolean;

  isEnabled: boolean;
}