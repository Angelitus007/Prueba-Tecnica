import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Hero } from '../../../models/hero';
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { Dialog } from '@angular/cdk/dialog';
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

  readonly hero = input<Hero>();

  private readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(DialogComponent);
  }

  deleteHero(): void {
    const hero = this.hero();
    if (hero) {
      this.dialog.open(DialogComponent, {
        data: {
          hero: hero,
          dialogToShow: Dialogs.DeleteHero,
        }
      });
    }
  }

  updateHero(): void {
    const hero = this.hero();
    if (hero) {
      this.dialog.open(DialogComponent, {
        data: {
          hero: hero,
          dialogToShow: Dialogs.UpdateHero,
        }
      });
    }
  }

}
