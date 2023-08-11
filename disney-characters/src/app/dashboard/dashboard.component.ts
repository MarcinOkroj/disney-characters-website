import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CharacterInterface } from '../shared/interfaces/character.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  favArr: any[] = [];
  charsArr: CharacterInterface[] = [];
  displayedColumns: string[] = ['img', 'name', 'films', 'favourite'];
  dataSource: any;
  pageSize = 50;
  id: number = 0;
  bestChars: any[] = [];
  filter: any;
  searchtimer: any;
  searchedChar: any;
  searchFlag: boolean = false;
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit() {
    if (localStorage['favChars'] === undefined)
      localStorage.setItem('favChars', JSON.stringify([]));
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
    chars.data.forEach((elem: CharacterInterface) => {
      if (elem.films.length >= 1) {
        this.charsArr.push(elem);
      }
    });
    this.dataSource = new MatTableDataSource(this.charsArr);
    this.filter3BestChars(3);
  }

  onFavClick(event: any, char: CharacterInterface) {
    if (event.target.classList.contains('fa-regular')) {
      //on add click
      this.addFav(event, char._id, char.name);
    } else if (event.target.classList.contains('fa-solid')) {
      //on remove click
      this.removeFav(event, char._id, char.name);
    }
  }

  addFav(event: any, charId: number, charName: string) {
    event.target.classList.remove('fa-regular');
    event.target.classList.add('fa-solid');
    event.target.style.color = 'yellow';
    if (!this.inLocalStorage(charId)) {
      this.favArr.push(charId);
      this.addLocalStorage(this.favArr);
      this.toastr.success('has been added to favourites', charName);
    }
  }

  removeFav(event: any, charId: number, charName: string) {
    event.target.classList.remove('fa-solid');
    event.target.classList.add('fa-regular');
    event.target.style.color = 'black';
    if (this.inLocalStorage(charId)) {
      this.favArr.splice(this.favArr.indexOf(charId), 1);
      this.addLocalStorage(this.favArr);
      this.toastr.warning('has been removed from favourites', charName);
    }
  }

  inLocalStorage(elem: number) {
    if (JSON.parse(localStorage['favChars']) !== 0) {
      this.favArr = JSON.parse(localStorage['favChars']);
      if (this.favArr.includes(elem)) return true;
    }
    return false;
  }

  addLocalStorage(favChars: string[]) {
    localStorage.setItem('favChars', JSON.stringify(favChars));
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
      this.http
        .get(
          `https://api.disneyapi.dev/character?name=${event.target.value
            .trim()
            .replace(' ', '%20')}`
        )
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
