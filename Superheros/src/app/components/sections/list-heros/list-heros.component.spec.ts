import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHerosComponent } from './list-heros.component';

describe('ListHerosComponent', () => {
  let component: ListHerosComponent;
  let fixture: ComponentFixture<ListHerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHerosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
