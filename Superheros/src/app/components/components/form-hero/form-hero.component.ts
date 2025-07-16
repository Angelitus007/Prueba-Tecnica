import { Component, inject, input, OnInit } from '@angular/core';
import { formTypes } from '../../../shared/formTypes';
import { Hero } from '../../../models/hero';
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { AlertMsgService } from '../../../services/alert-msg.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'c-form-hero',
  imports: [ReactiveFormsModule],
  templateUrl: './form-hero.component.html',
  styleUrl: './form-hero.component.scss'
})
export class FormHeroComponent implements OnInit{

  protected formTypesEnum = formTypes;
  public readonly formToShow = input<formTypes>();
  public readonly heroDataFromDialog = input<Hero>();
  private readonly _dialogRef = inject(MatDialogRef<FormHeroComponent>);

  private readonly _heroRequestService = inject(HeroRequestsService);
  private readonly _alertMsgService = inject(AlertMsgService);
  private readonly _fb = inject(FormBuilder);

  protected form!: FormGroup;
  private _selectedFile: File | null = null;

  ngOnInit(): void {
    this.inicializarForm();
    this.rellenarUpdateForm();
  }

  private inicializarForm(): void {
    this.form = this._fb.group({
      name: ['', [Validators.required]],
      superpower: ['', [Validators.required]],
      city: ['', [Validators.required]],
      description: ['', [Validators.required]],
      photo: [null, [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  private rellenarUpdateForm(): void {
    if (this.formToShow() === formTypes.updateHero) {
      const heroData = this.heroDataFromDialog();

      if (heroData) {
        this.form.patchValue({
          name: heroData.name,
          superpower: heroData.superpower,
          city: heroData.city,
          description: heroData.description,
          photo: heroData.imageURL,
        });
      }
    }
  }

  protected onSubmit(): void {
    if(this.formToShow() === formTypes.createHero) {
        this._heroRequestService.createHero(this.heroConstruction());
        this._alertMsgService.showAlert('success', 'Héroe creado con éxito');
    } else {
        this._heroRequestService.updateHero(this.heroUpdate());
        this._alertMsgService.showAlert('success', 'Héroe modificado con éxito');
    }
    this.form.reset();
    this._dialogRef.close();
  }

  private heroConstruction(): Hero {
    const formValues = this.form.value;
    return {
      id: this._heroRequestService.getNextHeroId(),
      imageURL: formValues.photo,
      ...formValues,
    } as Hero;
  }

  private heroUpdate(): Hero {
    const formValues = this.form.value;
    return {
      id: this.heroDataFromDialog()?.id ?? '',
      imageURL: formValues.photo,
      ...formValues,
    } as Hero;
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this._selectedFile = input.files[0];
      const uploadedImageUrl = `http://localhost:3000/${this._selectedFile?.name}`;
      this.form.patchValue({ photo: uploadedImageUrl });
    }
  }
}
