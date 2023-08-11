import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CharacterInterface } from '../shared/interfaces/character.interface';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
})
export class FavouritesComponent {
  favArr: any[] = [];
  favCharsArr: CharacterInterface[] = [];
  displayedColumns: string[] = ['img', 'name', 'films', 'favourite'];
  dataSource: any;
  pageSize = 50;
  id: number = 0;
  filter: any;
  filteredCharsArr: CharacterInterface[] = [];

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit() {
    if (localStorage['favChars'] === undefined)
      localStorage.setItem('favChars', JSON.stringify([]));
    this.displayChar();
  }

  private getCharacter(charId: number) {
    this.http
      .get(`https://api.disneyapi.dev/character/${charId}`)
      .subscribe((char) => {
        this.fillFavCharArr(char);
        this.dataSource = new MatTableDataSource(this.favCharsArr);
      });
  }

  private fillFavCharArr(char: any) {
    this.favCharsArr.push(char.data);
  }

  private displayChar() {
    this.favArr = JSON.parse(localStorage['favChars']);
    this.favArr.forEach((id: number) => {
      this.getCharacter(id);
    });
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
      this.favCharsArr = [];
      this.displayChar();
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

  applyFilter(event:any){
    this.filteredCharsArr = this.favCharsArr.filter(item => item.name.toLowerCase().includes(event.target.value.toLowerCase()));
    this.displayFiltered(this.filteredCharsArr)
  }

  private displayFiltered(arr: any[]){
    this.dataSource = new MatTableDataSource(arr);
  }
}
