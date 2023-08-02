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

        const itemsPerPage = 5;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        const filteredCities: City[] = this.cityService
        .getCities()
        .filter(
          (city) => city.cityName.toLowerCase().includes(query.toLowerCase())
        );
        const matchingCount: number = filteredCities.length;
        
        if(sort == SortEnum.citySortAsc){ //sort by city name
            filteredCities.sort((a, b) => a.cityName.localeCompare(b.cityName));
        }
        else if(sort == SortEnum.citySortDesc){
            filteredCities.sort((a, b) => b.cityName.localeCompare(a.cityName));
        }
        else if(sort == SortEnum.countSortAsc){
            filteredCities.sort((a, b) => a.count - b.count);
        }
        else { //sort by count descending
            filteredCities.sort((a, b) => b.count - a.count);
        }
        
        const matchedCities: City[] = filteredCities.slice(startIndex, endIndex);

        return { cities: matchedCities, totalCount: matchingCount };
    }
}