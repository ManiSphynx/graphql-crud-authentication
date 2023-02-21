import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  super_user = 'super_user',
}

registerEnumType(ValidRoles, { name: 'ValidRoles' });
