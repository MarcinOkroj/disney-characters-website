import { Injectable } from '@angular/core';
import { CharacterInterface } from '../interfaces/character.interface';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class FavService {
  favArr: any[] = [];

  constructor(private toastr: ToastrService) { }

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
}
