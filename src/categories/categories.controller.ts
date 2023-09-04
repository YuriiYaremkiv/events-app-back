import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CategoriesService } from './categories.service';
import { CountryDto, UpdatedCountryDto } from './dto/country.dto';
import { RequestCountryDto } from './dto/req.country.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('country')
  getCountry(@Query() reqCountry: RequestCountryDto) {
    return this.categoriesService.getCountry(reqCountry);
  }

  @Post('country')
  @UseGuards(AccessTokenGuard)
  addCountry(
    @Body() newCountry: CountryDto,
    @Query() reqCountry: RequestCountryDto,
  ) {
    return this.categoriesService.addCountry({ newCountry, reqCountry });
  }

  @Patch('country')
  @UseGuards(AccessTokenGuard)
  updateCountry(@Body() updatedCountry: UpdatedCountryDto) {
    return this.categoriesService.updateCountry(updatedCountry);
  }

  @Delete('country/:countryId')
  @UseGuards(AccessTokenGuard)
  deleteCountry(
    @Param('countryId') countryId: string,
    @Query() reqCountry: RequestCountryDto,
  ) {
    return this.categoriesService.deleteCountry({ countryId, reqCountry });
  }
}
