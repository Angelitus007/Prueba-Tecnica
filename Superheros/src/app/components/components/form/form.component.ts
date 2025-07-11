import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { formTypes } from '../../../shared/formTypes';
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { debounce, debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Hero } from '../../../models/hero';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'c-form',
  imports: [ReactiveFormsModule, CommonModule, MatDialogClose],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {

  protected formTypes = formTypes;
  formToShow = input<formTypes>();
  heroDataFromDialog = input<Hero>();


  formFields: Array<{ controlName: string; type: string; label?: string; placeholder?: string; validators?: any[] }> = [];

  searchFormFields = [
    { controlName: 'filter', type: 'text', placeholder: 'Busca un héroe' }
  ];

  heroFormFields = [
    { controlName: 'name', type: 'text', label: 'Nombre', placeholder: 'Nombre', validators: [Validators.required] },
    { controlName: 'superpower', type: 'text', label: 'Superpoder', placeholder: 'Superpoder', validators: [Validators.required] },
    { controlName: 'city', type: 'text', label: 'Ciudad', placeholder: 'Ciudad', validators: [Validators.required] },
    { controlName: 'description', type: 'text', label: 'Descripción', placeholder: 'Ingresa una descripción', validators: [Validators.required] },
    { controlName: 'photo', type: 'text', label: 'Foto', placeholder: 'URL de la foto' , validators: [Validators.required] },
    { controlName: 'terms', type: 'checkbox', label: 'Acepto los ', validators: [Validators.requiredTrue] }
  ];

  private fb = inject(FormBuilder);
  form!: FormGroup;

  private readonly _heroRequestService = inject(HeroRequestsService);

  inicializarForm(controls: Array<{ controlName: string; validators?: any[] }>) {
    this.form = this.fb.group(
      controls.reduce((formControls: { [key: string]: any }, field: { controlName: string; validators?: any[] }) => {
        formControls[field.controlName] = [field.controlName === 'terms' ? false : '', field.validators || []];
        return formControls;
      }, {})
    );
  }

  ngOnInit(): void {
    this.selectFormType();
  }

  selectFormType(): void {
    if (this.formToShow() === formTypes.searchHero) {
      this.formFields = this.searchFormFields;
      this.inicializarForm(this.formFields);
      this.detectFilterChanges();
    } else {
      this.formFields = this.heroFormFields;
      this.inicializarForm(this.formFields);

      if (this.formToShow() === formTypes.updateHero) {
        this.rellenarForm();
      }
    }
  }

  rellenarForm(): void {
    if (this.heroDataFromDialog()) {
      this.form.patchValue({
        name: this.heroDataFromDialog()?.name,
        superpower: this.heroDataFromDialog()?.superpower,
        city: this.heroDataFromDialog()?.city,
        description: this.heroDataFromDialog()?.description,
        photo: this.heroDataFromDialog()?.imageURL
      });
    }
  }

  onSubmit(): void {
    console.log('Formulario enviado:', this.form.value);

    if( this.formToShow() === formTypes.createHero) {
        const newHero = this.heroConstruction();
        this._heroRequestService.createHero(newHero);
        this.form.reset();
    } else if (this.formToShow() === formTypes.updateHero) {
        const updatedHero = this.heroUpdate();
        this._heroRequestService.updateHero(updatedHero);
        this.form.reset();
    }
  }

  heroConstruction(): Hero {
    const newHero: Hero = {
      id: this._heroRequestService.getNextHeroId(),
      name: this.form.get('name')?.value,
      superpower: this.form.get('superpower')?.value,
      city: this.form.get('city')?.value,
      description: this.form.get('description')?.value,
      imageURL: this.form.get('photo')?.value
    };
    return newHero;
  }

  heroUpdate(): Hero {
    const updatedHero: Hero = {
      id: this.heroDataFromDialog()?.id ?? '',
      name: this.form.get('name')?.value,
      superpower: this.form.get('superpower')?.value,
      city: this.form.get('city')?.value,
      description: this.form.get('description')?.value,
      imageURL: this.form.get('photo')?.value
    };
    return updatedHero;
  }

  detectFilterChanges(): void {
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

  filterHeroes(): void {
    const filterValue = this.form.get('filter')?.value;

    if (filterValue) {
      const filteredHeroes = this._heroRequestService.heroes().filter(hero =>
        hero.name.toLowerCase().includes(filterValue.toLowerCase()));

      this._heroRequestService.setHeroes(filteredHeroes);
    }
  }

  getButtonText(): string {
    switch (this.formToShow()) {
      case formTypes.createHero:
        return 'Crear Héroe';
      case formTypes.updateHero:
        return 'Guardar cambios';
      default:
        return '';
    }
  }
}
