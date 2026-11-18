import {
    ExceptionFilter, HttpException, Catch, ArgumentsHost, HttpStatus, Logger
} from '@nestjs/common'
import type {Request, Response} from 'express';

@Catch()

export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception:unknown, host:ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException  ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      let rootCause: unknown = exception;
      while (rootCause instanceof Error && rootCause.cause !== undefined) {
        rootCause = rootCause.cause;
      }

      const errorDetails = rootCause instanceof Error
        ? rootCause.stack ?? rootCause.message
        : String(rootCause);
      this.logger.error(`${request.method} ${request.url} failed`, errorDetails);
    }

    const message = typeof exceptionResponse === "string"
      ? exceptionResponse
      : ((exceptionResponse as Record<string, unknown>).message ?? exceptionResponse);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}