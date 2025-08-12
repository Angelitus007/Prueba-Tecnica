import { Component, inject, output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Dialogs } from '@constants/dialogs';
import { DialogData } from '@models/dialog-data';
import { Hero } from '../../../models/hero';
import { FormHeroComponent } from '../form-hero/form-hero.component';
import { Forms } from '@constants/forms';

@Component({
  selector: 'c-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    FormHeroComponent,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  public dialogData: DialogData = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef);

  protected readonly dialog = Dialogs;
  protected readonly form = Forms;

  public createHero = output<Omit<Hero, 'id'>>();
  public updateHero = output<Hero>();
  public deleteHero = output<string>();

  protected onDeleteHero(): void {
    this.deleteHero.emit(this.dialogData.heroID!);
  }

  protected onCreateHero(hero: Omit<Hero, 'id'>): void {
    this.createHero.emit(hero);
    this.dialogRef.close();
  }

  protected onUpdateHero(hero: Hero): void {
    this.updateHero.emit(hero);
    this.dialogRef.close();
  }
}
