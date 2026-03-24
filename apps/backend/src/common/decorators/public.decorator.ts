import { SetMetadata } from "@nestjs/common";
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from "../guard/roles.guard";

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

export const Authenticated = () => UseGuards(JwtAuthGuard, RolesGuard);
