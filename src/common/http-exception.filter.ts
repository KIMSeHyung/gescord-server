import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = Object(exception.getResponse());
    let msg: string = res.message;
    if (typeof res.message === 'object') {
      msg = msg[0];
    }

    return { ok: false, message: msg };
  }
}
