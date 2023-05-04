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
} from '@nestjs/common';
import { EventService } from './events.service';
import { EventDto } from './dto/event.dto';
import { CityDto } from './dto/city.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get('city')
  getCity() {
    return this.eventService.getCity();
  }

  @Post('city')
  @UseInterceptors(FileInterceptor('picture'))
  addCity(@UploadedFile() file: Express.Multer.File, @Body() cityDto: CityDto) {
    return this.eventService.addCity(cityDto, file);
  }

  @Patch('city')
  @UseInterceptors(FileInterceptor('picture'))
  updateCity(
    @UploadedFile() file: Express.Multer.File,
    @Body() cityDto: CityDto,
  ) {
    return this.eventService.updateCity(cityDto, file);
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
  @UseInterceptors(FileInterceptor('picture'))
  addEvent(
    @UploadedFile() file: Express.Multer.File,
    @Body() eventDto: EventDto,
  ) {
    return this.eventService.addEvent(eventDto, file);
  }

  @Get()
  getAllCategories() {
    return this.eventService.getAllCategories();
  }
}
