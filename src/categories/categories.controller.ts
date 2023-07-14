import {
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Controller,
  Body,
  Param,
} from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CategoriesService } from './categories.service';
import { CountryDto } from './dto/country.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('country')
  @UseGuards(AccessTokenGuard)
  getCountry() {
    return this.categoriesService.getCountry();
  }

  @Post('country')
  @UseGuards(AccessTokenGuard)
  addCountry(@Body() newCountry: CountryDto) {
    return this.categoriesService.addCountry(newCountry);
  }

  @Patch('country/:countryId')
  @UseGuards(AccessTokenGuard)
  updateCountry(
    @Param('countryId') countryId: string,
    @Body() updatedCountry: CountryDto,
  ) {
    return this.categoriesService.updateCountry({ countryId, updatedCountry });
  }

  @Delete('country/:countryId')
  @UseGuards(AccessTokenGuard)
  deleteCountry(@Param('countryId') countryId: string) {
    return this.categoriesService.deleteCountry(countryId);
  }
}
