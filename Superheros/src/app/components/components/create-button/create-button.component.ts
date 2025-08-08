import { Component, output } from '@angular/core';

@Component({
  selector: 'c-create-button',
  imports: [],
  templateUrl: './create-button.component.html',
  styleUrl: './create-button.component.scss',
})
export class CreateButtonComponent {
  public buttonClicked = output<void>();

  protected onClick(): void {
    this.buttonClicked.emit();
  }
}
