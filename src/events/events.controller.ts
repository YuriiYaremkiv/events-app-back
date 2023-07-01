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
import { CityDto } from './dto/city.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get('cities/list')
  getCities(@Query() req: Request) {
    return this.eventService.getCities(req);
  }

  @Get('city')
  getCity(@Query() req: Request) {
    return this.eventService.getCities(req);
  }

  @UseGuards(AccessTokenGuard)
  @Post('city')
  @UseInterceptors(FileInterceptor('picture'))
  addCity(@UploadedFile() file: Express.Multer.File, @Body() cityDto: CityDto) {
    return this.eventService.addCity(cityDto, file);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('city')
  @UseInterceptors(FileInterceptor('picture'))
  updateCity(
    @UploadedFile() file: Express.Multer.File,
    @Body() cityDto: CityDto,
  ) {
    return this.eventService.updateCity(cityDto, file);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('city/:cityId')
  deleteCity(@Param('cityId') cityId: string) {
    return this.eventService.deleteCity(cityId);
  }

  @Get('event/:cityName')
  getEvents(@Param('cityName') cityName: string, @Query() req: Request) {
    return this.eventService.getEvents({ cityName, req });
  }

  @Get('events')
  getAllEvents(@Query() req: Request) {
    return this.eventService.getAllEvents(req);
  }

  @Get('event/:cityName/:eventName')
  getSingleEvent(
    @Param('cityName') cityName: string,
    @Param('eventName') eventName: string,
  ) {
    return this.eventService.getSingleEvent({ cityName, eventName });
  }

  // @Get('event/:cityName')
  // getEvent(@Param('cityName') cityName: string, @Query() req: Request) {
  //   return this.eventService.getEvent({ cityName, req });
  // }

  // New block code
  @UseGuards(AccessTokenGuard)
  @Post('event')
  @UseInterceptors(FileInterceptor('picture'))
  addEvent(
    @UploadedFile() file: Express.Multer.File,
    @Body() eventDto: EventDto,
  ) {
    return this.eventService.addEvent(eventDto, file);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('event')
  @UseInterceptors(FileInterceptor('picture'))
  updateEvent(
    @UploadedFile() file: Express.Multer.File,
    @Body() eventDto: EventDto,
  ) {
    return this.eventService.updateEvent(eventDto, file);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('event/:cityId/:eventId')
  deleteEvent(
    @Param('cityId') cityId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.eventService.deleteEvent({ cityId, eventId });
  }
}
