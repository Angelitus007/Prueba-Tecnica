import { Component } from '@angular/core';
import { HeroCardComponent } from "../../components/hero-card/hero-card.component";

@Component({
  selector: 'app-list-heros',
  imports: [HeroCardComponent],
  templateUrl: './list-heros.component.html',
  styleUrl: './list-heros.component.scss'
})
export class ListHerosComponent {

}
