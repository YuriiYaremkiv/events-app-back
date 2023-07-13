import { TransformFnParams } from 'class-transformer';

export class TransformUtils {
  static stringToBoolean(params: TransformFnParams): boolean {
    const value = params.value as string;
    return value === 'true';
  }

  static stringToNumber(params: TransformFnParams): number {
    const value = params.value as string;
    return parseInt(value, 10);
  }

  static stringToObject(params: TransformFnParams): any {
    const value = params.value as string;
    return JSON.parse(value);
  }
}
