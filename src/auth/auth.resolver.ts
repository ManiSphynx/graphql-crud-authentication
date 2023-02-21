import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpInput, SignInInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './../users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<AuthResponse> {
    return await this.authService.signup(signUpInput);
  }

  @Mutation(() => AuthResponse, { name: 'signin' })
  async signin(
    @Args('signInInput') signInInput: SignInInput,
  ): Promise<AuthResponse> {
    return await this.authService.signin(signInInput);
  }

  @Query(() => AuthResponse, { name: 'refreshToken' })
  @UseGuards(JwtAuthGuard)
  refreshToken(
    @CurrentUser(/* [ValidRoles.ADMIN] */) user: User,
  ): AuthResponse {
    return this.authService.refreshToken(user);
  }
}
