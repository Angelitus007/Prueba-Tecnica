import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { formTypes } from '../../../shared/formTypes';
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Hero } from '../../../models/hero';
import { MatDialogClose } from '@angular/material/dialog';
import { AlertMsgService } from '../../../services/alert-msg.service';

@Component({
  selector: 'c-form',
  imports: [ReactiveFormsModule, CommonModule, MatDialogClose],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {

  protected formTypesEnum = formTypes;
  public readonly formToShow = input<formTypes>();
  public readonly heroDataFromDialog = input<Hero>();

  private readonly _heroRequestService = inject(HeroRequestsService);
  private readonly _alertMsgService = inject(AlertMsgService);
  private readonly _fb = inject(FormBuilder);

  protected form!: FormGroup;
  protected formFields: Array<{ controlName: string; type: string; label?: string; placeholder?: string; validators?: any[] }> = [];
  private _selectedFile: File | null = null;

  private _searchFormFields = [
    { controlName: 'filter', type: 'text', placeholder: 'Busca un héroe' }
  ];

  private _heroFormFields = [
    { controlName: 'name', type: 'text', label: 'Nombre', placeholder: 'Nombre', validators: [Validators.required] },
    { controlName: 'superpower', type: 'text', label: 'Superpoder', placeholder: 'Superpoder', validators: [Validators.required] },
    { controlName: 'city', type: 'text', label: 'Ciudad', placeholder: 'Ciudad', validators: [Validators.required] },
    { controlName: 'description', type: 'text', label: 'Descripción', placeholder: 'Ingresa una descripción', validators: [Validators.required] },
    { controlName: 'photo', type: 'file', label: 'Elegir una imagen', validators: [Validators.required] },
    { controlName: 'terms', type: 'checkbox', label: 'Acepto los ', validators: [Validators.requiredTrue] }
  ];

  private inicializarForm(controls: Array<{ controlName: string; validators?: any[] }>) {
    this.form = this._fb.group(
      controls.reduce((formControls: { [key: string]: any }, field: { controlName: string; validators?: any[] }) => {
        formControls[field.controlName] = [field.controlName === 'terms' ? false : '', field.validators || []];
        return formControls;
      }, {})
    );
  }

  public ngOnInit(): void {
    this.selectFormType();
  }

  private selectFormType(): void {
    if (this.formToShow() === formTypes.searchHero) {
      this.setupSearchForm();
    } else {
      this.setupHeroForm();
    }
  }

  private setupSearchForm(): void {
    this.formFields = this._searchFormFields;
    this.inicializarForm(this.formFields);
    this.detectFilterChanges();
  }

  private setupHeroForm(): void {
    this.formFields = this._heroFormFields;
    this.inicializarForm(this.formFields);

    if (this.formToShow() === formTypes.updateHero) {
      this.rellenarForm();
    }
  }

  private rellenarForm(): void {
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

  protected onSubmit(): void {

    if( this.formToShow() === formTypes.createHero) {
        const newHero = this.heroConstruction();
        this._heroRequestService.createHero(newHero);
        this._alertMsgService.showAlert('success', 'Héroe creado con éxito');
        this.form.reset();
    } else if (this.formToShow() === formTypes.updateHero) {
        const updatedHero = this.heroUpdate();
        this._heroRequestService.updateHero(updatedHero);
        this._alertMsgService.showAlert('success', 'Héroe modificado con éxito');
        this.form.reset();
    }
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

  private detectFilterChanges(): void {
    this.form.get('filter')?.valueChanges
    .pipe(debounceTime(500))
    .subscribe((filterValue: string) => {
      if (!filterValue?.trim()) {
        this._heroRequestService.restoreOriginalHeroes();
      }
      else {
        this.filterHeroes();
      }
    });
  }

  private filterHeroes(): void {
    const filterValue = this.form.get('filter')?.value;

    if (filterValue) {
      const filteredHeroes = this._heroRequestService.heroes().filter(hero =>
        hero.name.toLowerCase().includes(filterValue.toLowerCase()));

      this._heroRequestService.setHeroes(filteredHeroes);
    }
  }

  protected getButtonText(): string {
    switch (this.formToShow()) {
      case formTypes.createHero:
        return 'Crear Héroe';
      case formTypes.updateHero:
        return 'Guardar cambios';
      default:
        return '';
    }
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
