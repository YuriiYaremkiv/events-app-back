import { TransformFnParams } from 'class-transformer';

export class TransformUtils {
  static stringToBoolean(params: TransformFnParams): boolean {
    const value = params.value as string;
    return value === 'true';
  }

  static stringToNumberInt(params: TransformFnParams): number {
    const value = params.value as string;
    return parseInt(value, 10);
  }

  static stringToNumberFloat(params: TransformFnParams): number {
    const value = params.value as string;
    return Number(parseFloat(value).toFixed(1));
  }

  static stringToObject(params: TransformFnParams): any {
    const value = params.value as string;
    return JSON.parse(value);
  }
}
