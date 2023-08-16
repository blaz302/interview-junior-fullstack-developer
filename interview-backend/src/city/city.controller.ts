import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './city.model';
import { SortEnum } from './sort.enum';

@Controller('city')
export class CityController {
    constructor(private cityService: CityService) {}

    @Get('search')
    searchCities(
        @Query('query') query: string,
        @Query('page') page: number,
        @Query('sort') sort: SortEnum,
    ): { cities: City[]; totalCount: number } {
        const filteredCities: City[] = this.cityService.getCities(query, page, sort);
        const matchingCount: number = filteredCities.length;
        return { cities: filteredCities, totalCount: matchingCount };
    }
}