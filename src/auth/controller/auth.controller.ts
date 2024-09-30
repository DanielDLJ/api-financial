import { Controller, Post, HttpStatus, HttpCode, Body } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
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
  @Post('register')
  @ApiOperation({ summary: 'Sign up' })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    description: 'User registered',
    type: SignInResponseDto,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}