import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { EventService } from './events.service';
import { EventDto } from './dto/event.dto';
import { CityDto } from './dto/city.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get('city')
  getCategories() {
    return this.eventService.getCities();
  }

  @Post('city')
  @UseInterceptors(FileInterceptor('picture'))
  async addCity(
    @UploadedFile() file: Express.Multer.File,
    @Body() cityDto: CityDto,
  ) {
    return this.eventService.addCity(cityDto, file);
  }

  @Delete('city/:cityId')
  deleteCity(@Param('cityId') cityId: string) {
    return this.eventService.deleteCity(cityId);
  }

  @Get('event/:id')
  getEvent(@Param('id') id: string) {
    return this.eventService.getEvent(id);
  }

  @Post('event')
  addEvent(@Body() eventDto: EventDto) {
    return this.eventService.addEvent(eventDto);
  }

  @Get()
  getAllCategories() {
    return this.eventService.getAllCategories();
  }
}
