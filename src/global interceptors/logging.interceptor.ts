import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap,map } from 'rxjs/operators';

@Injectable()

export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
      return next.handle().pipe(
        map(data => {
          // if (data.transactions && data.transactions.length === 0)  data.transactions = null
           { data.requestTime = `${Date.now() - now} ms` };
           return data as {}
        }),
      );
    }
  }
