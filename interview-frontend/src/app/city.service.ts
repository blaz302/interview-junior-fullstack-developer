import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from './city.model';
import { SortEnum } from './sort.enum';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private apiUrl = 'http://localhost:3000/city/search'; //where nest.js is running

  constructor(private http: HttpClient) { }

  searchCities(query: string, page: number, sort: SortEnum) {
    return this.http.get<{ cities: City[]; totalCount: number }>(this.apiUrl, { params: { query, page, sort } });
  }
}
