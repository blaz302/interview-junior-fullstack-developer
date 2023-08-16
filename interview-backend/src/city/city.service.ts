import { Injectable } from '@nestjs/common';
import { City } from './city.model';
import * as fs from 'fs';
import { SortEnum } from './sort.enum';

//reads cities from json file

@Injectable()
export class CityService {
  private cities: City[] = [];

  constructor() {
    this.loadCitiesFromFile();
  }

  private loadCitiesFromFile(): void {
    try {
      const citiesJson = fs.readFileSync('../cities.json', 'utf8'); //read from the file outside the interview-backend folder, not the one inside data folder
      this.cities = JSON.parse(citiesJson);
    } catch (err) {
      console.error('Error loading cities from file:', err);
    }
  }

  getCities(query: string, page: number, sort: SortEnum): City[] {
    const itemsPerPage = 5;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const filteredCities: City[] = this.cities
    .filter(
      (city) => city.cityName.toLowerCase().includes(query.toLowerCase()) || city.cityName.toLowerCase().includes(query.replaceAll("oe", 'ö').toLowerCase()) || city.cityName.toLowerCase().includes(query.replaceAll("ae", 'ä').toLowerCase()) || city.cityName.toLowerCase().includes(query.replaceAll("ue", 'ü').toLowerCase())
    );
    
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
    
    return filteredCities.slice(startIndex, endIndex);
  }
}