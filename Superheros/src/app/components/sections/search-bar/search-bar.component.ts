import { Component } from '@angular/core';
import { formTypes } from '../../../shared/formTypes';
import { FormSearchComponent } from "../../components/form-search/form-search.component";

@Component({
  selector: 'section-search-bar',
  imports: [FormSearchComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
}
