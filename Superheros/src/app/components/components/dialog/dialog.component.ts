import { Component, Inject, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialogs } from '../../../shared/dialogTypes';
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { Hero } from '../../../models/hero';

@Component({
  selector: 'c-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  private _dialogToShow!: string;
  public dialogType = Dialogs;

  set dialogToShow(str: string) { this._dialogToShow = str; }
  get dialogToShow(): string { return this._dialogToShow; }

  private readonly heroRequestsService = inject(HeroRequestsService);

  heroData = inject(MAT_DIALOG_DATA);

  deleteHero(hero: Hero): void {
    this.heroRequestsService.deleteHero(hero.id);
    console.log('Hero deleted:', hero.name);
  }
}



