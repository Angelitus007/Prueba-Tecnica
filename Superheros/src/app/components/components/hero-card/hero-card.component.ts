import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Hero } from '../../../models/hero';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Dialogs } from '../../../shared/dialogTypes';

@Component({
  selector: 'c-hero-card',
  imports: [],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCardComponent {

  public readonly hero = input<Hero>();

  private readonly dialog = inject(MatDialog);

  protected deleteHero(): void {
    const hero = this.hero();
    if (hero) {
      this.dialog.open(DialogComponent, {
        width: '43.9375rem',
        height: '16.6875rem',
        position: { top: '5%' },

        data: {
          hero: hero,
          dialogToShow: Dialogs.DeleteHero,
        }
      });
    }
  }

  protected updateHero(): void {
    const hero = this.hero();
    if (hero) {
      this.dialog.open(DialogComponent, {
        position: { top: '5%' },

        data: {
          hero: hero,
          dialogToShow: Dialogs.UpdateHero,
        }
      });
    }
  }

}
