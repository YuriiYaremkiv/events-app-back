import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from '../schema/city.schema';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { NodemailerService } from '../cloud/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
  ],
  providers: [MailService, NodemailerService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
