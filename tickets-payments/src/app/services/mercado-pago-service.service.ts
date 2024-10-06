import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketPayDto } from '../models/TicketPayDto';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoServiceService {  
  private apiUrl = '/api/mercadopago/crear-preferencia';

  constructor(private http: HttpClient) {}

  crearPreferencia(orderData: TicketPayDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }

  initMercadoPagoButton(preferenceId: string): void {
    const mp = new (window as any).MercadoPago('APP_USR-6dde02ef-5a92-4b88-a959-d4fb62cf9fa4');
    const bricksBuilder = mp.bricks();

    bricksBuilder.create('wallet', 'wallet_container', {
      initialization: {
        preferenceId: preferenceId 
      },
      customization: {
        texts: {
          valueProp: 'smart_option',
        },
      },
      callbacks: {
        onError: (error: any) => console.error(error),
        onReady: () => { console.log('Checkout ready'); }
      }
    });
  }
}