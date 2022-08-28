import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user';
import { PasswordHashService } from '../password-hash';
import { RefreshTokenService } from '../refresh-token';

interface LoginOptions {
  email: string;
  password: string;
}

interface SignUpOptions extends LoginOptions {
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private passwordHashService: PasswordHashService,
    private jwtService: JwtService
  ) {}

  async login({ email, password }: LoginOptions) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const match = await this.passwordHashService.compare({
      password,
      hash: user.hashedPassword
    });

    if (!match) throw new UnauthorizedException();

    return this.createToken(user.id);
  }

  async signUp({ name, email, password }: SignUpOptions) {
    const user = await this.userService.findByEmail(email);

    if (user) throw new ConflictException('User with this email address already exists.');

    const hashedPassword = await this.passwordHashService.hash(password);

    const userId = await this.userService.create({ name, email, hashedPassword }).then((user) => user.id);

    return this.createToken(userId);
  }

  async renewToken(refreshToken: string) {
    const token = await this.refreshTokenService.renewById(refreshToken);

    if (!token) throw new UnauthorizedException();

    return this.createToken(token.userId, token.id);
  }

  async logout(refreshToken: string) {
    await this.refreshTokenService.invalidateById(refreshToken);
  }

  private async createToken(userId: number, token?: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(userId),
      token ?? this.createRefreshToken(userId)
    ]);

    return { accessToken, refreshToken };
  }

  private async createAccessToken(userId: number) {
    return this.jwtService.signAsync({ sub: userId });
  }

  private async createRefreshToken(userId: number) {
    const token = await this.refreshTokenService.createForUser(userId);
    return token.id;
  }
}
