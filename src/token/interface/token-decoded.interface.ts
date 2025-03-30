import { Role } from '@prisma/client';
import { Scope } from '../enum/scope.enum';

export interface ITokenDecoded {
  sub: number;
  name: string;
  email: string;
  role: Role;
  scope: Scope;
  iat: number;
  exp: number;
}
