import { Component, OnInit } from '@angular/core';
import { TicketDetail, TicketDto, TicketStatus } from '../models/TicketDto';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap'; // Importa Bootstrap JS
import { MercadoPagoServiceService } from '../services/mercado-pago-service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../services/ticket.service';
import { TicketPayDto } from '../models/TicketPayDto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-list-expensas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-list-expensas.component.html',
  styleUrls: ['./admin-list-expensas.component.css']
})
export class AdminListExpensasComponent implements OnInit {

  requestData: TicketPayDto = {
    idTicket: 0,
    title: '',
    description: '',
    totalPrice: 0
  };
  
  ticketSelectedModal: TicketDto = {
    id: 0,
    ownerId: 0,
    issueDate: new Date(),
    expirationDate: new Date(),
    status: TicketStatus.PENDING,
    ticketDetails: []
  };
  
  listallticket: TicketDto[] = [];
  searchText = '';
  filteredTickets: TicketDto[] = [];
  fechasForm: FormGroup;

  constructor(
    private mercadopagoservice: MercadoPagoServiceService, 
    private formBuilder: FormBuilder, 
    private ticketservice: TicketService
  ) {
    this.fechasForm = this.formBuilder.group({
      fechaInicio: [''],
      fechaFin: ['']
    });
  }

  ngOnInit(): void {
    this.getTickets();
  }

  // Método para obtener todos los tickets usando el servicio
  getTickets(): void {
    this.ticketservice.getAllTickets().subscribe({
      next: (tickets: TicketDto[]) => {
        this.listallticket = tickets;
        this.filteredTickets = tickets;
      },
      error: (error) => {
        console.error('Error al obtener los tickets:', error);
      },
      complete: () => {
        console.log('Obtención de tickets completada.');
      }
    });
  }

  enviarFechas() {
    const fechas = this.fechasForm.value;
    console.log('Fechas Enviadas:', fechas);
    this.ticketservice.filtrarfechas(fechas).subscribe(
      (filteredTickets: TicketDto[]) => {
        this.filteredTickets = filteredTickets;
      },
      (error) => {
        console.error('Error al filtrar tickets por fechas:', error);
      }
    );
  }

  searchTable() {
    const searchTextLower = this.searchText.toLowerCase();
    const searchNumber = parseFloat(this.searchText);

    this.filteredTickets = this.listallticket.filter(ticket =>
      ticket.ownerId.toString().includes(this.searchText) ||
      ticket.ticketDetails.some(item => item.description.toLowerCase().includes(searchTextLower)) ||
      ticket.status.toString().includes(searchTextLower.toLocaleUpperCase()) ||
      this.formatDate2(ticket.issueDate, 'MM/YYYY').includes(searchTextLower) ||
      this.formatDate2(ticket.expirationDate, 'MM/YYYY').includes(searchTextLower) ||
      (!isNaN(searchNumber) && this.calculateTotal(ticket) === searchNumber)
    );
  }

  formatDate2(date: Date, format: string): string {
    const pad = (num: number) => num < 10 ? '0' + num : num.toString();
    if (format === 'MM/YYYY') {
      return `${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    } else { 
      const day = pad(date.getDate());
      const month = pad(date.getMonth() + 1);
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  }

  calculateTotal(ticket: TicketDto): number {
    let total = 0;
    if (ticket && ticket.ticketDetails) {
      total = ticket.ticketDetails.reduce((acc, item: TicketDetail) => {
        return acc + item.amount;
      }, 0);
    }
    return total;
  }

  selectTicket(ticket: TicketDto) {
    this.ticketSelectedModal = ticket;
    console.log('Ticket seleccionado:', this.ticketSelectedModal); 
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  pagar() {
    this.requestData.idTicket = this.ticketSelectedModal.id;
    this.requestData.description = `Expensas de ${this.formatDate(this.ticketSelectedModal.issueDate)}`;
    this.requestData.title = `Expensas de ${this.formatDate(this.ticketSelectedModal.issueDate)} con vencimiento: ${this.formatDate(this.ticketSelectedModal.expirationDate)}`;
    this.requestData.totalPrice = this.calculateTotal(this.ticketSelectedModal);
    console.log(this.requestData);
    this.mercadopagoservice.crearPreferencia(this.requestData).subscribe(
      (response) => {
        console.log('Preferencia creada:', response);
        this.mercadopagoservice.initMercadoPagoButton(response.id);
      },
      (error) => {
        console.error('Error al crear la preferencia:', error);
      }
    );
  }

  changeStatusOfTicket() {
    throw new Error('Method not implemented.');
  }

  downloadPdf(ticketId: Number): void {
    this.ticketservice.downloadPdf(ticketId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'example.pdf'; // Nombre del archivo descargado
      link.click();
      window.URL.revokeObjectURL(url); // Limpia la URL del blob después de la descarga
    }, error => {
      console.error('Error al descargar el PDF:', error);
    });
  }




}
