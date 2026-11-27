import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "MI_CODIGO_SECRETO"
        })
    }

    async validate(payload: any) {
        return {
            cedula: payload.cedula || payload.email,
            email: payload.email || payload.cedula,
            email1: payload.email1,
            id_usuario: payload.sub || payload.id_usuario,
            rol: payload.rol
        };
    }
}
