import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertMsgService } from '../../../services/alert-msg.service';
import { CommonModule } from '@angular/common';
import { Alert } from '../../../models/alert';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent implements OnInit {

  protected isDisplayed = signal<boolean>(false);
  private readonly _alertService = inject(AlertMsgService);
  alert: Alert | null = null;

  public ngOnInit(): void {
    this._alertService.alert$.subscribe((alert: Alert) => {
      this.alert = alert;
      this.isDisplayed.set(true);

      setTimeout(() => {
        this.isDisplayed.set(false);
        this.alert = null;
      }, 3000);
    });
  }
}
