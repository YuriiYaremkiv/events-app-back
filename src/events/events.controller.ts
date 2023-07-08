import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EventService } from './events.service';
import { EventDto } from './dto/event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RequestEventDto } from './dto';

@Controller('event')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get(':cityName/:eventName')
  getSingleEvent(
    @Query() reqEvent: RequestEventDto,
    @Param('cityName') cityName: string,
    @Param('eventName') eventName: string,
  ) {
    return this.eventService.getEvent({ reqEvent, cityName, eventName });
  }

  @Get(':cityName')
  getEvent(
    @Query() reqEvent: RequestEventDto,
    @Param('cityName') cityName: string,
  ) {
    return this.eventService.getEvent({ reqEvent, cityName });
  }

  @Get()
  getAllEvent(@Query() reqEvent: RequestEventDto) {
    return this.eventService.getEvent({ reqEvent });
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  addEvent(
    @Query() reqEvent: RequestEventDto,
    @Body() newEvent: EventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventService.addEvent({ reqEvent, newEvent, file });
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  @UseInterceptors(FileInterceptor('picture'))
  updateEvent(
    @Body() updatedEvent: EventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventService.updateEvent({ updatedEvent, file });
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':cityId/:eventId')
  deleteEvent(
    @Param('cityId') cityId: string,
    @Param('eventId') eventId: string,
    @Query() reqEvent: RequestEventDto,
  ) {
    return this.eventService.deleteEvent({ reqEvent, cityId, eventId });
  }
}
