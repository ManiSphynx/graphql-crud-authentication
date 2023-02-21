import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpInput, SignInInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from './../users/users.service';
import { User } from './../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string): string {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpInput);
    const token = this.getJwtToken(user.id);

    return { user, token };
  }

  async signin(signInInput: SignInInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(signInInput.email);

    if (!bcrypt.compareSync(signInInput.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.getJwtToken(user.id);

    return { user, token };
  }

  async revalidateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user.isActive) throw new UnauthorizedException('User is not active');

    delete user.password;

    return user;
  }

  refreshToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return { user, token };
  }
}
