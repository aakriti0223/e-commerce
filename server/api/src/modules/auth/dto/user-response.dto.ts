// DTO

import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e44567-e89b--12d3-a456-42661417400',
  })
  id!: string;

  @ApiProperty({
    description: 'User Email address',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    nullable: true,
  })
  firstName!: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    nullable: true,
  })
  lastName!: string | null;

  @ApiProperty({ description: 'User role', enum: Role })
  role!: Role;

  @ApiProperty({
    description: 'Account creation date',
    example: '2023-10-01T12:34:56.789Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last account update date',
    example: '2023-10-01T12:34:56.789Z',
  })
  updatedAt!: Date;
}
