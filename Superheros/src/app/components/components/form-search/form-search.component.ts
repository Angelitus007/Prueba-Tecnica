import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Hero } from '../../../models/hero';
import { HeroRequestsService } from '../../../services/hero-requests.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'c-form-search',
  imports: [ReactiveFormsModule],
  templateUrl: './form-search.component.html',
  styleUrl: './form-search.component.scss'
})
export class FormSearchComponent implements OnInit, OnDestroy {

  public readonly heroDataFromDialog = input<Hero>();

  private readonly _heroRequestService = inject(HeroRequestsService);
  private readonly _fb = inject(FormBuilder);

  private readonly _destroy$ = new Subject<void>(); // Por convención.

  protected form!: FormGroup;

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private initForm(): void {
    this.form = this._fb.group({
      filter: ['']
    });
    this.detectFilterChanges();
  }

  private detectFilterChanges(): void {
    this.form.get('filter')?.valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this._destroy$)
      )
      .subscribe((filterValue: string) => {
        this._heroRequestService.loadHeroes(1, filterValue || '');
      });
  }
}
