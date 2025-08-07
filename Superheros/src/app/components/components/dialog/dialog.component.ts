import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialogs, DialogType } from '../../../constants/dialogs';
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { Hero } from '../../../models/hero';
import { formTypes } from '../../../constants/forms';
import { AlertMsgService } from '../../../services/alert-msg.service';
import { FormHeroComponent } from "../form-hero/form-hero.component";

@Component({
  selector: 'c-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle, FormHeroComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {

  protected dialogEnum = Dialogs;
  protected dialogToShow!: DialogType;

  protected formTypesEnum = formTypes;
  protected hero!: Hero;

  private readonly _alertMsgService = inject(AlertMsgService);
  private readonly _heroRequestsService = inject(HeroRequestsService);
  heroData = inject(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this.initDataFromDialog();
  }

  private initDataFromDialog(): void {
    if (this.heroData) {
      this.dialogToShow = this.heroData.dialogToShow;
      this.hero = this.heroData.hero;
    }
  }

  protected deleteHero(): void {
    if (this.hero.id !== undefined) {
      this._heroRequestsService.deleteHero(this.hero.id);
      this._alertMsgService.showAlert({ type: 'success', message: 'Este héroe se ha eliminado'});
    }
  }
}

