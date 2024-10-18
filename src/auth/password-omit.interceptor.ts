/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PasswordOmitResponse implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((userObj) => this.omitPassword(userObj));
        }
        return this.omitPassword(data);
      }),
    );
  }

  private omitPassword(userObj: any) {
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  }
}
