import { Component } from '@angular/core';
import { FormSearchComponent } from "../../components/form-search/form-search.component";
import { CreateButtonComponent } from "../../components/create-button/create-button.component";

@Component({
  selector: 'section-search-creation',
  imports: [FormSearchComponent, CreateButtonComponent],
  templateUrl: './search-creation.component.html',
  styleUrl: './search-creation.component.scss'
})
export class SearchCreationComponent {

}
