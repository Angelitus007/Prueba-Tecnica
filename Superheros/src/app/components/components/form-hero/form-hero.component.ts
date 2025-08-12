import { Component, inject, input, OnInit, output } from '@angular/core';
import { Forms, FormType } from '../../../constants/forms';
import { Hero } from '../../../models/hero';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'c-form-hero',
  imports: [ReactiveFormsModule],
  templateUrl: './form-hero.component.html',
  styleUrl: './form-hero.component.scss',
})
export class FormHeroComponent implements OnInit {
  protected formType = Forms;
  public formDisplay = input.required<FormType>();
  public heroData = input<Hero>();

  private readonly fb = inject(FormBuilder);

  public createHero = output<Omit<Hero, 'id'>>();
  public updateHero = output<Hero>();

  protected form!: FormGroup;
  public selectedFile?: string;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      superpower: ['', [Validators.required]],
      city: ['', [Validators.required]],
      description: ['', [Validators.required]],
      photo: [null],
      terms: [false, [Validators.requiredTrue]],
    });

    if (this.formDisplay() === this.formType.updateHero) {
      this.fillFormWithHeroData();
    } else {
      this.form.get('photo')?.setValidators([Validators.required]);
    }
  }

  private fillFormWithHeroData(): void {
    this.form.patchValue({
      ...this.heroData(),
      photo: undefined,
    });
  }

  protected onSubmit(): void {
    if (this.formDisplay() === this.formType.createHero) {
      this.createHero.emit({
        ...this.form.value,
        photo: this.selectedFile,
        terms: false,
      });
    } else {
      this.updateHero.emit({
        ...this.form.value,
        id: this.heroData()?.id,
        photo: this.selectedFile || this.heroData()?.photo,
        terms: false,
      });
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = `http://localhost:3000/${input.files[0].name}`; // FIXME: Adjust this URL with ENVS
    }
  }
}
