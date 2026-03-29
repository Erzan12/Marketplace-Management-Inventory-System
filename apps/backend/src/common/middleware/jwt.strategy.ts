import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../shared/types/interface';
import { RequestUser } from '../../shared/types/request-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService, private readonly prisma: PrismaService) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request): string | null => {
                return typeof request.cookies?.['accessToken'] === 'string'
                    ? request.cookies['accessToken']
                    : null;
                },
            ]),

            secretOrKey: secret,
        });
    }

    async validate(payload: JwtPayload): Promise<RequestUser> {
        const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
            include: {
                orders: true,
                stores: true,
                cartItem: true, 
                userProfile: true,
            }
        });

        if (!user) {
            throw new Error('User not found'); // or UnauthorizedException for JWT guard
        }

        return { 
            id: user.id,
            email: user.email,
            role: user.role,
            token_version: user.token_version,
            request_token: user.refresh_token ?? null, // nullable
            is_active: user.is_active,
        };
    }
}
