import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  type: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertMsgService {

  // Así solo el servicio puede emitir eventos
  private alertSubject = new Subject<Alert>();

  // Los otros componentes que se suscriban recibirán los eventos emitidos
  alert$ = this.alertSubject.asObservable();

  showAlert(type: string, message: string): void {
    console.log(`Alert Type: ${type}, Message: ${message}`);
    this.alertSubject.next({ type, message });
  }
}
