import { SetMetadata } from '@nestjs/common';
import { ADMIN_ROLES } from 'src/base.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ADMIN_ROLES[]) => SetMetadata(ROLES_KEY, roles);
