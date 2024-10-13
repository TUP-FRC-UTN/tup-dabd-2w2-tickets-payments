import { Component } from '@angular/core';
import { TicketDetail, TicketDto, TicketStatus } from '../models/TicketDto';
import { CommonModule } from '@angular/common';
import { MercadoPagoServiceService } from '../services/mercado-pago-service.service';
import { TicketPayDto } from '../models/TicketPayDto';

@Component({
  selector: 'app-owner-list-expensas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner-list-expensas.component.html',
  styleUrl: './owner-list-expensas.component.css'
})
export class OwnerListExpensasComponent {
  requestData: TicketPayDto = {
    idTicket: 0,
    title: '',
    description: '',
    totalPrice: 0
  };
  ticketSelectedModal: TicketDto = {
    id: 0,
    owner_id: 0,
    emision_date: new Date(),
    expiration_date: new Date(),
    status: TicketStatus.PENDING,
    items: [] 
  };
  listallticket: TicketDto[] = [
    {
      id: 1,
      owner_id: 1001,
      emision_date: new Date('2024-01-01'),
      expiration_date: new Date('2024-12-31'),
      status: TicketStatus.PENDING,
      items: [
        { id: 1, name: 'Item A', description: 'Description of Item A', quantity: 2, price: 50 },
        { id: 2, name: 'Item B', description: 'Description of Item B', quantity: 1, price: 100 },
      ]
    },
    {
      id: 2,
      owner_id: 1002,
      emision_date: new Date('2024-02-15'),
      expiration_date: new Date('2024-08-15'),
      status: TicketStatus.PAID,
      items: [
        { id: 3, name: 'Item C', description: 'Description of Item C', quantity: 3, price: 30 },
        { id: 4, name: 'Item D', description: 'Description of Item D', quantity: 4, price: 25 },
      ]
    },
    {
      id: 3,
      owner_id: 1003,
      emision_date: new Date('2024-03-10'),
      expiration_date: new Date('2024-09-10'),
      status: TicketStatus.CANCELED,
      items: [
        { id: 5, name: 'Item E', description: 'Description of Item E', quantity: 5, price: 15 },
        { id: 6, name: 'Item F', description: 'Description of Item F', quantity: 2, price: 60 },
      ]
    }
  ];

  constructor(private mercadopagoservice: MercadoPagoServiceService) { }
  calculateTotal(ticket: TicketDto): number {
    let total = 0;
    if (ticket && ticket.items) {
      total = ticket.items.reduce((acc, item: TicketDetail) => {
        return acc + (item.quantity * item.price);
      }, 0);
    }
    return total;
  }

  selectTicket(ticket: TicketDto) {
    this.ticketSelectedModal = ticket

  }
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  pagar() {
    this.requestData.idTicket = this.ticketSelectedModal.id
    this.requestData.description = `Expensas de ${this.formatDate(this.ticketSelectedModal.emision_date)}`;
    this.requestData.title = `Expensas de ${this.formatDate(this.ticketSelectedModal.emision_date)} con vencimiento: ${this.formatDate(this.ticketSelectedModal.expiration_date)}`;
    this.requestData.totalPrice = this.calculateTotal(this.ticketSelectedModal)
    console.log(this.requestData)
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
}
