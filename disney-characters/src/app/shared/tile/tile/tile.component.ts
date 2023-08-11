import { Component, Input } from '@angular/core';
import { CharacterInterface } from '../../interfaces/character.interface';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {

  @Input() displayChar!: CharacterInterface;

  tooltipText(elem: any) {
    return elem.tvShows.join(', ');
  }
}
