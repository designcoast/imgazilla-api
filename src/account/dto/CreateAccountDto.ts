import { IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  id: string;

  @IsString()
  name: string;
}
