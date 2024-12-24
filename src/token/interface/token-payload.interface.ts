import { Role } from '@prisma/client';

export interface ITokenPayload {
  sub: number;
  name: string;
  email: string;
  role: Role;
}
