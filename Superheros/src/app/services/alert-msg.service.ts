import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertMsgService {

  private alertSubject: Subject<Alert> = new Subject<Alert>();

  public alert$(): Observable<Alert> {
    return this.alertSubject.asObservable();
  }

  public showAlert(alert: Alert): void {
    this.alertSubject.next(alert);
  }
}
