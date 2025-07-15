import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { Dialogs } from '../../../shared/dialogTypes';

@Component({
  selector: 'section-create-hero',
  imports: [],
  templateUrl: './create-hero.component.html',
  styleUrl: './create-hero.component.scss'
})
export class CreateHeroComponent {

  private readonly dialog = inject(MatDialog);

  protected createHero(): void {
    this.dialog.open(DialogComponent, {
      data: {
        dialogToShow: Dialogs.CreateHero,
      }
    });
  }
}
