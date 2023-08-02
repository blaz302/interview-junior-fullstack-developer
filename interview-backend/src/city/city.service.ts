import { Injectable } from '@nestjs/common';
import { City } from './city.model';
import * as fs from 'fs';

//reads cities from json file

@Injectable()
export class CityService {
  private cities: City[] = [];

  constructor() {
    this.loadCitiesFromFile();
  }

  private loadCitiesFromFile(): void {
    try {
      const citiesJson = fs.readFileSync('../cities.json', 'utf8');
      this.cities = JSON.parse(citiesJson);
    } catch (err) {
      console.error('Error loading cities from file:', err);
    }
  }

  getCities(): City[] {
    return this.cities;
  }

  getCityByName(name: string): City | undefined {
    return this.cities.find((city) => city.cityName === name);
  }
}