import { Injectable } from "@nestjs/common/decorators";
import { CanActivate, ExecutionContext } from "@nestjs/common/interfaces";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class RequestGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        // console.log(request.user)
        return true
    }

}