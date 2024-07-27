import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from "@nestjs/common";
import { error } from "console";
import { catchError, Observable, throwError } from "rxjs";


@Injectable()

export class ErrorsInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(catchError((err)=> throwError(()=> err )))
    }
}
// new HttpException(err.response,err.status)