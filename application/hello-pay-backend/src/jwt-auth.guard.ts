import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            console.log(info);
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                success: false,
                message: 'Token Signature could not be verified.',
                error: info?.message || 'Token validation failed'
            });
        }
        return user;
    }
}
