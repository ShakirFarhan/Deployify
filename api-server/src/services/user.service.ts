import { prismaClient } from '../client';
import { User } from '../types/user.type';
import { randomBytes } from 'crypto';
import { encryptPassword } from '../utils/encryption';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
class UserService {
  public static async create(
    data: Omit<User, 'id' | 'accountStatus' | 'role'>
  ) {
    return await prismaClient.user.create({
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        githubAccessToken: true,
        githubUsername: true,
        verified: true,
      },
    });
  }

  public static async findById(id: string) {
    return await prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  }
  public static async findByEmail(email: string) {
    return await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }
  public static async update(
    userId: string,
    data: Partial<Omit<User, 'role'>>
  ) {
    await prismaClient.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }
}

export default UserService;
