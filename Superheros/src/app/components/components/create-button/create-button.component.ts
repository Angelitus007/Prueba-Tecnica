import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dialogs } from '../../../shared/dialogTypes';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'c-create-button',
  imports: [],
  templateUrl: './create-button.component.html',
  styleUrl: './create-button.component.scss'
})
export class CreateButtonComponent {

  private readonly dialog = inject(MatDialog);

  protected createHero(): void {
    this.dialog.open(DialogComponent, {
      data: {
        dialogToShow: Dialogs.CreateHero,
      }
    });
  }

}
