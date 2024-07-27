import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "src/schemas/User.schema";
// import { Request } from "express";

// export const GetUser = createParamDecorator((data,req)=>{
//     return req.user

// })

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext): User => {
      const req = ctx.switchToHttp().getRequest();
      return req.user;
    },
  );