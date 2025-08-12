import { Component, input } from '@angular/core';
import { AlertState } from '@models/alert';

@Component({
  selector: 'alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  public alertState = input<AlertState>();
}
