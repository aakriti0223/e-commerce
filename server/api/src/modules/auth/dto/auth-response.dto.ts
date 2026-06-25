// DTO for auth response

import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/client';
export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token for authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNzE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @ApiProperty({
    description: 'Refresh token for obtaining new access tokens',
    example: 'dGhpc19pc19hX3JlZnJlc2hfdG9rZW5fZXhhbXBsZV9zdHJpbmc=',
  })
  accessToken!: string;

  refreshToken!: string;

  @ApiProperty({
    description: 'Authenticated user information',
    example: {
      id: 'user-123',
      email: '<EMAIL>',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  })
  user!: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
  };
}
