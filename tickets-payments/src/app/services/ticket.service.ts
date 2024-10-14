import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketDto } from '../models/TicketDto';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://localhost:8080/api/tickets';
  constructor(private http: HttpClient) { }

  filtrarfechas(dtobusqueda: any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/search`, dtobusqueda);
  }

// Método para obtener todos los tickets
  getAllTickets(): Observable<TicketDto[]> 
  {
    return this.http.get<TicketDto[]>('http://localhost:8080/tickets/getAll');
  }
  
}
