import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
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

  @Delete('city')
  deleteCity() {
    return 'delete this city';
  }

  @Get()
  getAllCategories() {
    return this.eventService.getAllCategories();
  }

  @Post()
  createCategory(@Body() eventDto: EventDto) {
    return this.eventService.createCategory(eventDto);
  }
}
