import { Component, inject, input, OnInit } from '@angular/core';
import { formTypes } from '../../../shared/formTypes';
import { Hero } from '../../../models/hero';
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { AlertMsgService } from '../../../services/alert-msg.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  private readonly _heroRequestService = inject(HeroRequestsService);
  private readonly _alertMsgService = inject(AlertMsgService);
  private readonly _fb = inject(FormBuilder);

  protected form!: FormGroup;
  protected formFields: Array<{ controlName: string; type: string; label?: string; placeholder?: string; validators?: any[] }> = [];
  private _selectedFile: File | null = null;

  private _heroFormFields = [
    { controlName: 'name', type: 'text', label: 'Nombre', placeholder: 'Nombre', validators: [Validators.required] },
    { controlName: 'superpower', type: 'text', label: 'Superpoder', placeholder: 'Superpoder', validators: [Validators.required] },
    { controlName: 'city', type: 'text', label: 'Ciudad', placeholder: 'Ciudad', validators: [Validators.required] },
    { controlName: 'description', type: 'text', label: 'Descripción', placeholder: 'Ingresa una descripción', validators: [Validators.required] },
    { controlName: 'photo', type: 'file', label: 'Elegir una imagen', validators: [Validators.required] },
    { controlName: 'terms', type: 'checkbox', label: 'Acepto los ', validators: [Validators.requiredTrue] }
  ];

  ngOnInit(): void {
    this.inicializarForm();
  }

  private inicializarForm(): void {
  }

  public onSubmit(): void {

  }

}
