import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Hero } from '@models/hero';

@Component({
  selector: 'c-hero-card',
  imports: [],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCardComponent {
  public hero = input<Hero>();
  public openDeleteDialog = output<string>();
  public openUpdateDialog = output<Hero>();

  protected onDeleteClick(): void {
    this.openDeleteDialog.emit(this.hero()!.id);
  }

  protected onUpdateClick(): void {
    this.openUpdateDialog.emit(this.hero()!);
  }
}
