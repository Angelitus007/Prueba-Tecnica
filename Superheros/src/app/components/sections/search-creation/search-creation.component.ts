import { Component, input, output } from '@angular/core';
import { CreateButtonComponent } from '@components/components/create-button/create-button.component';
import { SearchInputComponent } from "@components/components/search-input/search-input.component";

@Component({
  selector: 'section-search-creation',
  imports: [CreateButtonComponent, SearchInputComponent],
  templateUrl: './search-creation.component.html',
  styleUrl: './search-creation.component.scss',
})
export class SearchCreationComponent {
  public createHeroClicked = output<void>();
  public filter = input<string>();
  public filterChange = output<string>();

  protected onCreateHero(): void {
    this.createHeroClicked.emit();
  }

  protected onFilterChanged(filterValue: string): void {
    this.filterChange.emit(filterValue);
  }
}
