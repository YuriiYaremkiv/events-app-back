import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async isEmailOrUsernameTaken(
    username: string,
    email: string,
  ): Promise<{ usernameTaken: boolean; emailTaken: boolean }> {
    const user = await this.userModel
      .findOne({
        $or: [{ email }, { username }],
      })
      .exec();

    return {
      usernameTaken: !!(user?.username === username),
      emailTaken: !!(user?.email === email),
    };
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel
      .find({}, { password: 0, refreshToken: 0, __v: 0 })
      .exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }
}
