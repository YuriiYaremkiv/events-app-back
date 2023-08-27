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
import { EventDataResponse } from 'interfaces';

@Controller('event')
export class EventsController {
  constructor(private eventService: EventService) {}

  //--------------------------------------------------------------------------------------
  @Get('admin/:cityId/:eventId')
  getEventById(
    @Param('cityId') cityId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.eventService.getEventById({ cityId, eventId });
  }

  @Get('admin/:cityId')
  getEventsByCityId(
    @Query() reqEvent: RequestEventDto,
    @Param('cityId') cityId: string,
  ) {
    return this.eventService.getEventsByCityId({ reqEvent, cityId });
  }

  //---------------------------------------------------------------------------------------

  @Get('params/:cityName')
  getEventParams(@Param('cityName') cityName: string) {
    return this.eventService.getEventParams(cityName);
  }

  @Get('recommendation/:cityName/:eventName')
  getRecommendedEvents(
    @Param('cityName') cityName: string,
    @Param('eventName') eventName: string,
  ) {
    return this.eventService.getRecommendedEvents(cityName, eventName);
  }

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
  ): Promise<any> {
    return this.eventService.getEvent({ reqEvent, cityName });
  }

  @Get()
  getAllEvent(@Query() reqEvent: RequestEventDto): Promise<any> {
    return this.eventService.getEvent({ reqEvent });
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('picture'))
  addEvent(
    @Query() reqEvent: RequestEventDto,
    @Body() newEvent: EventDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.eventService.addEvent({ reqEvent, newEvent, file });
  }

  @Patch()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('picture'))
  updateEvent(
    @Body() updatedEvent: EventDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.eventService.updateEvent({ updatedEvent, file });
  }

  @Delete(':cityId/:eventId')
  @UseGuards(AccessTokenGuard)
  deleteEvent(
    @Param('cityId') cityId: string,
    @Param('eventId') eventId: string,
    @Query() reqEvent: RequestEventDto,
  ): Promise<any> {
    return this.eventService.deleteEvent({ reqEvent, cityId, eventId });
  }
}
