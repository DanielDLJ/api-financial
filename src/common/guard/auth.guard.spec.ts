import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Role } from '@prisma/client';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockImplementation((key: string) => {
              if (key === 'jwt.secret') {
                return process.env.JWT_SECRET;
              }
            }),
          },
        },
        AuthGuard,
        JwtService,
        Reflector,
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(reflector).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should allow access if the route is public (isPublic)', async () => {
    const context: ExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as any;

    const isPublic = true;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);

    const result = await authGuard.canActivate(context);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    expect(result).toBe(true);
  });

  it('should deny access if no token is provided', async () => {
    const request = { path: '/users', headers: {} } as Request;
    const context: ExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    const isPublic = false;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);

    await expect(authGuard.canActivate(context)).rejects.toThrowError(
      UnauthorizedException,
    );

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('should assign user payload to the request object if the token is valid', async () => {
    const token = 'eyJhb';
    const request = {
      path: '/users',
      headers: { authorization: `Bearer ${token}` },
    } as Request;
    const context: ExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;
    const isPublic = false;
    const payload = { email: 'ana@hotmail.com', id: 1, role: Role.USER };

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

    const result = await authGuard.canActivate(context);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
      secret: configService.getOrThrow('jwt.secret'),
    });
    expect(context.switchToHttp().getRequest()['user']).toEqual(payload);
    expect(result).toBe(true);
  });

  it('should deny access if the token is invalid', async () => {
    const token = 'eyJhb';
    const request = {
      path: '/users',
      headers: { authorization: `Bearer ${token}` },
    } as Request;
    const context: ExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;
    const isPublic = false;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('Invalid token'));

    await expect(authGuard.canActivate(context)).rejects.toThrowError(
      UnauthorizedException,
    );

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
      secret: configService.getOrThrow('jwt.secret'),
    });
  });
});
