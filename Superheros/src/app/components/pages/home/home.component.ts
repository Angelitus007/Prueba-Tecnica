import { Component } from '@angular/core';
import { SearchBarComponent } from "../../sections/search-bar/search-bar.component";
import { CreateHeroComponent } from "../../sections/create-hero/create-hero.component";
import { ListHerosComponent } from '../../sections/list-heros/list-heros.component';

@Component({
  selector: 'app-home',
  imports: [SearchBarComponent, CreateHeroComponent, ListHerosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
