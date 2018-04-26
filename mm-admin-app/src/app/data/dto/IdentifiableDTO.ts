import { Exclude } from 'class-transformer';

export abstract class IdentifiableDTO {

  @Exclude({ toPlainOnly: true })
  id: string;

}
