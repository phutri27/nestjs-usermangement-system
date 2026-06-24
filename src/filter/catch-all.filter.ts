import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Prisma } from '../generated/prisma/client'

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    let errMessage: string | string[]
    if (exception instanceof HttpException) {
      const excResponse = exception.getResponse()
      errMessage = (excResponse as any).message
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      errMessage = exception.code
    } else {
      errMessage = 'Internal server error'
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message: errMessage,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
