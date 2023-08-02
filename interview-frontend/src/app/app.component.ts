import { Component } from '@angular/core';
import { City } from './city.model';
import { CityService } from './city.service';
import { SortEnum } from './sort.enum';
import { trigger, transition, animate, style } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0.1 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})

export class AppComponent {
  title = 'interview-frontend';

  itemsPerPage: number = 5; //assuming 5 items per page
  searchQuery: string = '';
  page: number = 1;
  matchedCities: City[] = [];
  totalCount: number = 0;
  dataLoaded: boolean = false; //has the user made a search yet
  searching: boolean = false; //add a flag to indicate if search is in progress
  sortEnum = SortEnum; //to use enum in html code
  sort: SortEnum = SortEnum.citySortAsc; //by default we sort the cities alphabetically

  displayedColumns: string[] = ['index', 'cityName', 'count'];
  dataSource = new MatTableDataSource<City>([]);

  constructor(private cityService: CityService) { }

  onSearch() {
    this.searching = true;
    if (this.searchQuery.trim() !== '') {
      this.cityService.searchCities(this.searchQuery, this.page, this.sort).subscribe((response) => {
        this.totalCount = response.totalCount;

        if(this.getTotalPages() > 0 && this.getTotalPages() < this.page){ //so we don't remain on non-existing page
          this.page = this.getTotalPages() + 1;
          this.previousPage();
          return;
        }

        this.matchedCities = response.cities;
        this.dataSource.data = this.matchedCities;
      });
    } else {
      this.matchedCities = [];
      this.dataSource.data = this.matchedCities;
      this.totalCount = 0;
      this.page = 1;
    }

    this.dataLoaded = true;

    setTimeout(() => { //so loading animation is displayed
      this.searching = false;
    }, 500);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.onSearch();
    }
  }

  nextPage() {
    const totalPages = this.getTotalPages();
    if (this.page < totalPages) {
      this.page++;
      this.onSearch();
    }
  }

  getStartingElement(): number {
    return (this.page - 1) * this.itemsPerPage + 1;
  }

  onCancelInputClick() {
    this.searchQuery = '';
  }

  cityNameSort() {
    if(this.sort != SortEnum.citySortAsc){
      this.sort = SortEnum.citySortAsc;
    }
    else{
      this.sort = SortEnum.citySortDesc;
    }
    this.onSearch();
  }

  cityCountSort() {
    if(this.sort != SortEnum.countSortAsc){
      this.sort = SortEnum.countSortAsc;
    }
    else{
      this.sort = SortEnum.countSortDesc;
    }
    this.onSearch();
  }
}
