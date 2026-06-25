// import {
//   Injectable,
//   NotFoundException,
//   ConflictException,
// } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { UserResponseDto } from '../auth/dto/user-response.dto';
// import { UpdateUserDto } from '../auth/dto/update-user.dto';
// import { ChangePasswordDto } from '../auth/dto/change-password.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UsersService {
//   private readonly SALT_ROUNDS = 10;

//   constructor(private prisma: PrismaService) {}

//   async findConfigFile(userId: string): Promise<UserResponseDto> {
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         email: true,
//         firstName: true,
//         lastName: true,
//         role: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     return user;
//   }

//   async findAll(): Promise<UserResponseDto[]> {
//     return await this.prisma.user.findMany({
//       select: {
//         id: true,
//         email: true,
//         firstName: true,
//         lastName: true,
//         role: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });
//   }

//   async update(
//     userId: string,
//     updateUserDto: UpdateUserDto,
//   ): Promise<UserResponseDto> {
//     const existingUser = await this.prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!existingUser) {
//       throw new NotFoundException('User not found');
//     }

//     if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
//       const emailTaken = await this.prisma.user.findUnique({
//         where: { email: updateUserDto.email },
//       });

//       if (emailTaken) {
//         throw new ConflictException('Email is already taken');
//       }
//     }

//     return await this.prisma.user.update({
//       where: { id: userId },
//       data: updateUserDto,
//       select: {
//         id: true,
//         email: true,
//         firstName: true,
//         lastName: true,
//         role: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });
//   }

//   async changePassword(
//     userId: string,
//     changePasswordDto: ChangePasswordDto,
//   ): Promise<{ message: string }> {
//     const { currentPassword, newPassword } = changePasswordDto;

//     const user = await this.prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     const isPasswordValid = await bcrypt.compare(
//       currentPassword,
//       user.password,
//     );

//     if (!isPasswordValid) {
//       throw new NotFoundException('Current password is incorrect');
//     }

//     const isSamePassword = await bcrypt.compare(newPassword, user.password);

//     if (isSamePassword) {
//       throw new ConflictException(
//         'New password must be different from the current password',
//       );
//     }

//     const hashedNewPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

//     await this.prisma.user.update({
//       where: { id: userId },
//       data: { password: hashedNewPassword },
//     });

//     return { message: 'Password changed successfully' };
//   }

//   async remove(userId: string): Promise<{ message: string }> {
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     await this.prisma.user.delete({
//       where: { id: userId },
//     });

//     return { message: 'User account deleted successfully' };
//   }
// }

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { UserResponseDto } from '../auth/dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private prisma: PrismaService) {}

  async findConfigFile(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  findAll(): Promise<UserResponseDto[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailTaken) {
        throw new ConflictException('Email is already taken');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Current password is incorrect');
    }

    const isSamePassword = await compare(newPassword, user.password);

    if (isSamePassword) {
      throw new ConflictException(
        'New password must be different from the current password',
      );
    }

    const hashedNewPassword = await hash(newPassword, this.SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async remove(userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User account deleted successfully' };
  }
}
