import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { formTypes } from '../../../shared/formTypes';

@Component({
  selector: 'c-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {

  protected formTypes = formTypes;
  formToShow = input<formTypes>();

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

  inicializarForm(controls: Array<{ controlName: string; validators?: any[] }>) {
    this.form = this.fb.group(
      controls.reduce((formControls: { [key: string]: any }, field: { controlName: string; validators?: any[] }) => {
        formControls[field.controlName] = ['', field.validators || []];
        return formControls;
      }, {})
    );
  }

  ngOnInit(): void {

    if (this.formToShow() === formTypes.searchHero) {
      this.formFields = this.searchFormFields;
      this.inicializarForm(this.formFields);
    } else {
      this.formFields = this.heroFormFields;
      this.inicializarForm(this.formFields);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }

  getButtonText(): string {
    switch (this.formToShow()) {
      case formTypes.searchHero:
        return 'Buscar';
      case formTypes.createHero:
        return 'Crear Héroe';
      case formTypes.updateHero:
        return 'Guardar cambios';
      default:
        return '';
    }
  }

}
