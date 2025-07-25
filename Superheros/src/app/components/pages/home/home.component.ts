import { Component } from '@angular/core';
import { ListHerosComponent } from '../../sections/list-heros/list-heros.component';
import { SearchCreationComponent } from "../../sections/search-creation/search-creation.component";

@Component({
  selector: 'app-home',
  imports: [SearchCreationComponent, ListHerosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
