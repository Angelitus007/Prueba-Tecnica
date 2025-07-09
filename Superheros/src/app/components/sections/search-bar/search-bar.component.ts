import { Component } from '@angular/core';
import { FormComponent } from "../../components/form/form.component";
import { formTypes } from '../../../shared/formTypes';

@Component({
  selector: 'section-search-bar',
  imports: [FormComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  protected formTypes = formTypes;
}
