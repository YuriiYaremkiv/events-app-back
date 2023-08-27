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
import { CitiesService } from './cities.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CityDataResponse, ICityItem } from '../interfaces';
import { CityDto, RequestCityDto } from './dto';

@Controller('city')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  getCities(@Query() reqCity: RequestCityDto): Promise<CityDataResponse> {
    return this.citiesService.getCity(reqCity);
  }

  @Get(':cityId')
  @UseGuards(AccessTokenGuard)
  getCityById(@Param('cityId') cityId: string) {
    return this.citiesService.getCityById(cityId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('picture'))
  addCity(
    @Query() reqCity: RequestCityDto,
    @Body() newCity: CityDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CityDataResponse> {
    return this.citiesService.addCity({ reqCity, newCity, file });
  }

  @Patch()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('picture'))
  updateCity(
    @Body() updatedCity: CityDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ICityItem> {
    return this.citiesService.updateCity({ updatedCity, file });
  }

  @Delete(':cityId')
  @UseGuards(AccessTokenGuard)
  deleteCity(
    @Query() reqCity: RequestCityDto,
    @Param('cityId') cityId: string,
  ): Promise<CityDataResponse> {
    return this.citiesService.deleteCity({ reqCity, cityId });
  }
}
