import { Component, input, output } from '@angular/core';

@Component({
  selector: 'c-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  public filter = input<string>();
  public filterChange = output<string>();

  onFilterChange(event: Event): void {
    this.filterChange.emit((event.target as HTMLInputElement).value);
  }
}
