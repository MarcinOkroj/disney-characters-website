import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface Character {
  _id: number;
  films: Array<any>;
  shortFilms: Array<any>;
  tvShows: Array<any>;
  videoGames: Array<any>;
  parkAttractions: Array<any>;
  allies: Array<any>;
  enemies: Array<any>;
  sourceUrl: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  __v: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  favArr: any;
  filteredChars: Character[] = [];
  displayedColumns: string[] = ['img', 'name', 'films', 'favourite'];
  dataSource: any;
  pageSize = 100;
  id: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCharacters();
  }

  private getCharacters() {
    this.http
      .get(`https://api.disneyapi.dev/character?pageSize=${this.pageSize}`)
      .subscribe((chars) => {
        this.displayChars(chars);
      });
  }

  private displayChars(chars: any) {
    chars.data.forEach((elem: Character) => {
      if (elem.films.length >= 1) {
        this.filteredChars.push(elem);
      }
    });
    this.dataSource = new MatTableDataSource(this.filteredChars);
  }

  onFavClick(event: any, char: Character) {
    if (event.target.classList.contains('fa-regular')) {
      //on add click
      this.addFav(event, char.name);
    } else if (event.target.classList.contains('fa-solid')) {
      //on remove click
      this.removeFav(event, char.name);
    }
  }

  inLocalStorage(elem: string) {
    this.favArr = JSON.parse(localStorage['favChars']);
    if (this.favArr.includes(elem)) return true;
    return false;
  }

  addLocalStorage(favChars: string[]) {
    localStorage.setItem('favChars', JSON.stringify(favChars));
  }

  addFav(event: any, charName: string) {
    event.target.classList.remove('fa-regular');
    event.target.classList.add('fa-solid');
    event.target.style.color = 'yellow';
    if (!this.inLocalStorage(charName)) {
      this.favArr.push(charName);
      this.addLocalStorage(this.favArr);
    }
  }

  removeFav(event: any, charName: string) {
    event.target.classList.remove('fa-solid');
    event.target.classList.add('fa-regular');
    event.target.style.color = 'black';
    if (this.inLocalStorage(charName)) {
      this.favArr.splice(this.favArr.indexOf(charName), 1);
      this.addLocalStorage(this.favArr);
    }
  }

  tooltipText(elem: any) {
    return elem.tvShows.join(', ');
  }
}
