import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCreationComponent } from './search-creation.component';

describe('SearchCreationComponent', () => {
  let component: SearchCreationComponent;
  let fixture: ComponentFixture<SearchCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
