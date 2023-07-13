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
import { IEventItem, EventDataResponse } from 'interfaces';

@Controller('event')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get(':cityName/:eventName')
  getSingleEvent(
    @Query() reqEvent: RequestEventDto,
    @Param('cityName') cityName: string,
    @Param('eventName') eventName: string,
  ): Promise<EventDataResponse> {
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

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('picture'))
  addEvent(
    @Query() reqEvent: RequestEventDto,
    @Body() newEvent: EventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventService.addEvent({ reqEvent, newEvent, file });
  }

  @Patch()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('picture'))
  updateEvent(
    @Body() updatedEvent: EventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventService.updateEvent({ updatedEvent, file });
  }

  @Delete(':cityId/:eventId')
  @UseGuards(AccessTokenGuard)
  deleteEvent(
    @Param('cityId') cityId: string,
    @Param('eventId') eventId: string,
    @Query() reqEvent: RequestEventDto,
  ) {
    return this.eventService.deleteEvent({ reqEvent, cityId, eventId });
  }
}
