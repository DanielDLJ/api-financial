import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { TokenService } from '@/token/service/token.service';
import { ApiException } from '../exceptions/api.exception';
import { ApiErrorCode } from '../enums/api-error-codes.enum';
import { createMock } from '@golevelup/ts-jest';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;

  const mockTokenService = {
    verifyAccessToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        Reflector,
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if the route is public (isPublic)', async () => {
    const context = createMock<ExecutionContext>();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('should deny access if no token is provided', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    await expect(guard.canActivate(context)).rejects.toThrow(
      new ApiException({
        code: ApiErrorCode.TOKEN_INVALID,
        message: 'No token provided',
        statusCode: HttpStatus.UNAUTHORIZED,
      }),
    );
  });

  it('should assign user payload to the request object if the token is valid', async () => {
    const userPayload = {
      sub: 1,
      email: 'test@example.com',
      role: 'USER',
    };
    const request = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockTokenService.verifyAccessToken.mockResolvedValue(userPayload);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request['user']).toEqual(userPayload);
    expect(mockTokenService.verifyAccessToken).toHaveBeenCalledWith(
      'valid-token',
    );
  });

  it('should deny access if the token is invalid', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid-token',
          },
        }),
      }),
    });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockTokenService.verifyAccessToken.mockRejectedValue(
      new ApiException({
        code: ApiErrorCode.TOKEN_INVALID,
        message: 'Invalid token',
        statusCode: HttpStatus.UNAUTHORIZED,
      }),
    );

    await expect(guard.canActivate(context)).rejects.toThrow(
      new ApiException({
        code: ApiErrorCode.TOKEN_INVALID,
        message: 'Invalid token',
        statusCode: HttpStatus.UNAUTHORIZED,
      }),
    );
  });
});
