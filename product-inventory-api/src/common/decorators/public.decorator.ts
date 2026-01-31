import { SetMetadata } from "@nestjs/common";
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from "../guard/roles.guard";

export const Roles = (...roles: string[]) => SetMetadata('roles', roles); // dry guardlogic for roles

export const Authenticated = () => UseGuards(AuthGuard('jwt'), RolesGuard); // dry guardlogic for jwt token and auth
