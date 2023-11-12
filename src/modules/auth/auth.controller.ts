import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { LocalAuthGuard, JwtRefreshAuthGuard } from './guards';
import { GetCurrentUser, Public } from '../../common/decorators';
import { LoginAuthInput, AuthResponse } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'Authentication tokens created.',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiConflictResponse({
    description: 'something went wrong when generating the tokens',
  })
  @ApiBody({ type: LoginAuthInput })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@GetCurrentUser() user: User): Promise<AuthResponse> {
    return this.authService.login(user);
  }

  @ApiCreatedResponse({
    description: 'Authentication tokens created.',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiConflictResponse({
    description: 'something went wrong when generating the tokens',
  })
  @ApiHeader({ name: 'Bearer', description: 'refresh token', required: true })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  refreshToken(@GetCurrentUser() user: User): Promise<AuthResponse> {
    return this.authService.refreshToken(user);
  }
}
