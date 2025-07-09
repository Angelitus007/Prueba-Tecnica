import { Component, Inject, inject, OnInit } from '@angular/core';
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
import { FormComponent } from "../form/form.component";
import { formTypes } from '../../../shared/formTypes';

@Component({
  selector: 'c-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle, FormComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {

  protected Dialogs = Dialogs;
  protected dialogToShow!: Dialogs;

  protected formTypes = formTypes;
  protected hero!: Hero;

  private readonly heroRequestsService = inject(HeroRequestsService);

  heroData = inject(MAT_DIALOG_DATA);


  initDataFromDialog(): void {
    if (this.heroData) {
      this.dialogToShow = this.heroData.dialogToShow;
      this.hero = this.heroData.hero;
    }
  }

  ngOnInit(): void {
    this.initDataFromDialog();
  }

  deleteHero(): void {
    this.heroRequestsService.deleteHero(this.hero.id);
    console.log('Hero deleted:', this.hero.name);

    // Mostrar mensaje flotante de éxito de borrado con el snackbar
    // Pendiente
  }
}



