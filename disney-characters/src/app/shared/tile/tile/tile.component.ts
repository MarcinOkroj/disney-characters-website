import { Component, Input } from '@angular/core';
import { CharacterInterface } from '../../interfaces/character.interface';
import { FavService } from '../../services/fav.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  providers: [FavService],
})
export class TileComponent {

  @Input() displayChar!: CharacterInterface;

  constructor(public favService: FavService){}

  tooltipText(elem: any) {
    return elem.tvShows.join(', ');
  }
}
