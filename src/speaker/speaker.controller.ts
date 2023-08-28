import {
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Controller,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RequestSpeakerDto } from './dto/req.speaker.dto';
import { SpeakerService } from './speaker.service';
import { SpeakerDto } from './dto/speaker.dto';

@Controller('speaker')
export class SpeakerController {
  constructor(private speakerService: SpeakerService) {}

  @Get(':cityId/:eventId')
  @UseGuards(AccessTokenGuard)
  getSpeakers(
    @Query() reqSpeaker: RequestSpeakerDto,
    @Param('cityId') cityId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.speakerService.getSpeakers({ cityId, eventId, reqSpeaker });
  }

  @Post(':cityId/:eventId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('picture'))
  addSpeaker(
    @Query() reqSpeaker: RequestSpeakerDto,
    @Body() newSpeaker: SpeakerDto,
    @Param('cityId') cityId: string,
    @Param('eventId') eventId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.speakerService.addSpeaker({
      cityId,
      eventId,
      reqSpeaker,
      file,
      newSpeaker,
    });
  }

  @Patch(':cityId/:eventId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('picture'))
  updateSpeaker(
    @Body() updatedSpeaker: SpeakerDto,
    @Param('cityId') cityId: string,
    @Param('eventId') eventId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.speakerService.updateSpeaker({
      cityId,
      eventId,
      updatedSpeaker,
      file,
    });
  }

  @Delete(':cityId/:eventId/:speakerId')
  @UseGuards(AccessTokenGuard)
  deleteSpeaker(
    @Query() reqSpeaker: RequestSpeakerDto,
    @Param('cityId') cityId: string,
    @Param('eventId') eventId: string,
    @Param('speakerId') speakerId: string,
  ) {
    return this.speakerService.deleteSpeaker({
      cityId,
      eventId,
      speakerId,
      reqSpeaker,
    });
  }
}
