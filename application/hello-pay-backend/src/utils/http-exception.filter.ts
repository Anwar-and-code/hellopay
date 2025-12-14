import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : 500;

    response.status(status).json({
      success: false,
      message: exception.response?.message || exception.message || 'Internal Server Error',
      code: status,
      error: exception.response?.error || 'Internal Error'
    });
  }
}
