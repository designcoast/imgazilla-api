import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { Schema } from 'yup';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<any> {
    try {
      return await this.schema.validate(value);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
