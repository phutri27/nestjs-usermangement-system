import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse()
    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          status: res.success,
          statusCode: res.statusCode,
        },
      })),
    )
  }
}
