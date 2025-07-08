import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Hero } from '../../../models/hero';
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Dialogs } from '../../../shared/dialogTypes';

@Component({
  selector: 'c-hero-card',
  imports: [MatCardModule],
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
          hero: hero
        }
      });

      // this.heroRequestsService.deleteHero(hero.id);
      console.log('Hero deleted:', hero.name);
    }

  }

  updateHero(): void {
    console.log('Update hero:', this.hero());
  }

}
