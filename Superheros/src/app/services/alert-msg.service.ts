import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertMsgService {

  // Así solo el servicio puede emitir eventos
  private alertSubject = new Subject<Alert>();

  // Los otros componentes que se suscriban recibirán los eventos emitidos
  public alert$ = this.alertSubject.asObservable();

  public showAlert(type: string, message: string): void {
    console.log(`Alert Type: ${type}, Message: ${message}`);
    this.alertSubject.next({ type, message });
  }
}
