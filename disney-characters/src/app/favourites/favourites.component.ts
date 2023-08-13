import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CharacterInterface } from '../shared/interfaces/character.interface';
import { FavService } from '../shared/services/fav.service';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
  providers: [FavService],
})
export class FavouritesComponent {
  favArr: any[] = [];
  favCharsArr: CharacterInterface[] = [];
  displayedColumns: string[] = ['img', 'name', 'films', 'favourite'];
  dataSource: any;
  pageSize = 100;
  id: number = 0;
  filter: any;
  filteredCharsArr: CharacterInterface[] = [];

  constructor(public favService: FavService, public apiService: ApiService) {}

  ngOnInit() {
    if (localStorage['favChars'] === undefined)
      localStorage.setItem('favChars', JSON.stringify([]));
    this.displayChar();
  }

  private getCharacter(charId: number) {
    this.apiService.getCharacterById(charId).subscribe((char) => {
      this.fillFavCharArr(char);
      this.dataSource = new MatTableDataSource(this.favCharsArr);
    });
  }

  private fillFavCharArr(char: any) {
    this.favCharsArr.push(char.data);
  }

  private displayChar() {
    this.favCharsArr = [];
    this.favArr = JSON.parse(localStorage['favChars']);
    this.favArr.forEach((id: number) => {
      this.getCharacter(id);
    });
  }

  tooltipText(elem: any) {
    return elem.tvShows.join(', ');
  }

  applyFilter(event: any) {
    this.filteredCharsArr = this.favCharsArr.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    this.displayFiltered(this.filteredCharsArr);
  }

  private displayFiltered(arr: any[]) {
    this.dataSource = new MatTableDataSource(arr);
  }

  public onFavClick(event: Event, element: any) {
    this.favService.onFavClick(event, element);
    this.displayChar();
  }
}
