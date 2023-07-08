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
import { CitiesService } from './cities.service';
import { CityUpdateDto, CityCreateDto, RequestCityDto } from './dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@Controller('city')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  getCities(@Query() reqCity: RequestCityDto) {
    return this.citiesService.getCity({ reqCity });
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  addCity(
    @Query() reqCity: RequestCityDto,
    @Body() newCity: CityCreateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.citiesService.addCity({ reqCity, newCity, file });
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  @UseInterceptors(FileInterceptor('picture'))
  updateCity(
    @Body() updatedCity: CityUpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.citiesService.updateCity({ updatedCity, file });
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':cityId')
  deleteCity(
    @Query() reqCity: RequestCityDto,
    @Param('cityId') cityId: string,
  ) {
    return this.citiesService.deleteCity({ reqCity, cityId });
  }
}
