import { Component, inject, input, OnInit } from '@angular/core';
import { Hero } from '../../../models/hero';
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { AlertMsgService } from '../../../services/alert-msg.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'c-form-search',
  imports: [ReactiveFormsModule],
  templateUrl: './form-search.component.html',
  styleUrl: './form-search.component.scss'
})
export class FormSearchComponent implements OnInit {

  public readonly heroDataFromDialog = input<Hero>();

  private readonly _heroRequestService = inject(HeroRequestsService);
  private readonly _fb = inject(FormBuilder);

  protected form!: FormGroup;

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this._fb.group({
      filter: ['']
    });
    this.detectFilterChanges();
  }

  private detectFilterChanges(): void {
    this.form.get('filter')?.valueChanges
      .pipe(debounceTime(500))
      .subscribe((filterValue: string) => {
        if (!filterValue?.trim()) {
          this._heroRequestService.restoreOriginalHeroes();
        } else {
          this.filterHeroes(filterValue);
        }
      });
  }

  private filterHeroes(filterValue: string): void {
    const filteredHeroes = this._heroRequestService.originalHeroes.filter(hero =>
      hero.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    this._heroRequestService.setHeroes(filteredHeroes);
  }
}
