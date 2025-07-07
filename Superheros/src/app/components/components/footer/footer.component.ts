import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  private _currentYear: number = new Date().getFullYear();
  private _webName: string = 'SUPERHERO CRUD';

  get currentYear(): number {
    return this._currentYear;
  }

  get webName(): string {
    return this._webName;
  }
}
