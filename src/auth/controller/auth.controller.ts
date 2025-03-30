import { Controller, Post, HttpStatus, HttpCode, Body } from '@nestjs/common';
import { Public } from '@/common/decorators/public.decorator';
import { AuthService } from '../service/auth.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInDto } from '../dto/sign-in.dto';
import { SignInResponseDto } from '../dto/sign-in-response.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignUpResponseDto } from '../dto/sign-up-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RefreshTokenResponseDto } from '../dto/refresh-token-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User signed in',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up' })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    description: 'User registered',
    type: SignUpResponseDto,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh token' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Token refreshed',
    type: RefreshTokenResponseDto,
  })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.token);
  }
}
