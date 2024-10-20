import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateCreditsDto {
  @IsNotEmpty()
  @IsNumber()
  credits: number; // The new credits value
}
