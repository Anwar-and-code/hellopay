import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET||'uLVJX2ytIiU3FPV7FXa+okVAi1XWnim7d2CCU1h/e1c=',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
