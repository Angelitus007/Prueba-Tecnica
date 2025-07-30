import { TestBed } from '@angular/core/testing';
import { AlertMsgService } from './alert-msg.service';
import { firstValueFrom } from 'rxjs';
import { Alert } from '../models/alert';

describe('AlertMsgService', () => {
  let service: AlertMsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertMsgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debería emitir una alerta cuando se llama a showAlert', async () => {
    // GIVEN
    const alertType = 'success';
    const alertMessage = 'This is a test alert';

    // WHEN
    const alertPromise = firstValueFrom(service.alert$);
    service.showAlert(alertType, alertMessage);

    // THEN
    const expectedAlert: Alert = { type: alertType, message: alertMessage };
    expect(await alertPromise).toEqual(expectedAlert);
  });

});
