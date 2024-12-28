import { NumberField, StringField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginResDto {
  @Expose()
  @StringField()
  userId!: string;

  @Expose()
  @NumberField()
  tokenTTL!: number;
}
