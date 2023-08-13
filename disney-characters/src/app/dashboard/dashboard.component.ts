import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CharacterInterface } from '../shared/interfaces/character.interface';
import { FavService } from '../shared/services/fav.service';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [FavService],
})
export class DashboardComponent implements OnInit {
  favArr: any[] = [];
  charsArr: CharacterInterface[] = [];
  displayedColumns: string[] = ['img', 'name', 'films', 'favourite'];
  dataSource: any;
  pageSize = 100;
  id: number = 0;
  bestChars: any[] = [];
  filter: any;
  searchtimer: any;
  searchedChar: any;
  searchFlag: boolean = false;
  constructor(
    public favService: FavService,
    public apiService: ApiService
  ) {}

  ngOnInit() {
    if (localStorage['favChars'] === undefined)
      localStorage.setItem('favChars', JSON.stringify([]));
    this.getCharacters();
  }

  private getCharacters() {
    this.apiService.getCharacters(this.pageSize).subscribe((chars) => {
      this.displayChars(chars);
    });
  }

  private displayChars(chars: any) {
    chars.data.forEach((elem: CharacterInterface) => {
      if (elem.films.length >= 1) {
        this.charsArr.push(elem);
      }
    });
    this.dataSource = new MatTableDataSource(this.charsArr);
    this.filter3BestChars(3);
  }

  tooltipText(elem: any) {
    return elem.tvShows.join(', ');
  }

  filter3BestChars(count: number) {
    this.bestChars = this.charsArr
      .slice() //make shallow copy
      .sort((a, b) => b.films.length - a.films.length)
      .slice(0, count);
  }

  //character is shown when there is only 1 match
  applyFilter(event: any) {
    clearTimeout(this.searchtimer);
    this.searchFlag = false;
    this.searchtimer = setTimeout(() => {
      this.apiService
        .getCharacterByName(event.target.value)
        .subscribe((char) => {
          this.checkName(event, char);
        });
    }, 1200);
  }

  private checkName(event: any, char: any) {
    this.searchedChar = char;
    if (this.searchedChar.data.length !== undefined) {
      //if search gives more than 1 answer
      this.searchedChar = this.searchedChar.data.filter(
        (item: any) =>
          item.name.toLowerCase() === event.target.value.trim().toLowerCase()
      ); //filter char with name exact to input
      [this.searchedChar] = this.searchedChar; //deconstruct
    } else {
      //if search gives only one answer
      this.searchedChar = this.searchedChar.data;
    }
    if (this.searchedChar !== undefined)
      //this.searchedChar will be undefined if there are no exact matches
      this.searchFlag = true;
  }
}
