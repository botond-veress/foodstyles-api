import { Injectable } from '@nestjs/common';

import { hash, compare } from 'bcryptjs';

@Injectable()
export class PasswordHashService {
  async hash(password: string) {
    return hash(password, 12);
  }

  async compare({ password, hash }: { password: string; hash: string }) {
    return compare(password, hash).catch(() => false);
  }
}
