import { Component, OnInit } from '@angular/core';
import { TicketDetail, TicketDto, TicketStatus } from '../models/TicketDto';
import { CommonModule } from '@angular/common';
import { MercadoPagoServiceService } from '../services/mercado-pago-service.service';
import { TicketPayDto } from '../models/TicketPayDto';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TicketService } from '../services/ticket.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-owner-list-expensas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './owner-list-expensas.component.html',
  styleUrl: './owner-list-expensas.component.css',
})
export class OwnerListExpensasComponent implements OnInit {
  requestData: TicketPayDto = {
    idTicket: 0,
    title: '',
    description: '',
    totalPrice: 0,
  };

  ticketSelectedModal: TicketDto = {
    id: 0,
    ownerId: 0,
    issueDate: new Date(),
    expirationDate: new Date(),
    status: TicketStatus.PENDING,
    ticketDetails: [
      { id: 1, amount: 20, description: 'Description of Item A' },
    ],
  };

  listallticket: TicketDto[] = [];
  searchText = '';
  filteredTickets: TicketDto[] = [];
  fechasForm: FormGroup;

  selectedFile: File | null = null;

  constructor(
    private mercadopagoservice: MercadoPagoServiceService,
    private formBuilder: FormBuilder,
    private ticketservice: TicketService,
    private http: HttpClient
  ) {
    for (let index = 0; index < 24; index++) {
      const issueDate = new Date();
      issueDate.setMonth(issueDate.getMonth() + (index - 1));
      // Determine the status based on whether id is even or odd
      const status = index % 2 === 0 ? TicketStatus.PENDING : TicketStatus.PAID;
      const t: TicketDto = {
        id: index,
        ownerId: index,
        issueDate: issueDate,
        expirationDate: new Date(issueDate.setMonth(issueDate.getMonth() + 1)),
        status: status,
        ticketDetails: [
          {
            id: 1,
            amount: Math.floor(Math.random() * 100) + 1,
            description: 'Description of Item A',
          },
        ],
      };
      this.listallticket.push(t);
    }

    // this.listallticket.push(this.ticketSelectedModal);
    this.filteredTickets = this.listallticket;
    this.fechasForm = this.formBuilder.group({
      fechaInicio: [''],
      fechaFin: [''],
    });
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.http
        .post('http://localhost:8080/files/upload', formData)
        .subscribe(
          (response) => {
            console.log('File uploaded successfully!', response);
          },
          (error) => {
            console.error('Error uploading file:', error);
          }
        );
    }
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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

    this.filteredTickets = this.listallticket.filter(
      (ticket) =>
        ticket.issueDate.toString().includes(this.searchText) ||
        ticket.ticketDetails.some((item) =>
          item.description.toLowerCase().includes(searchTextLower)
        ) ||
        ticket.status
          .toString()
          .includes(searchTextLower.toLocaleUpperCase()) ||
        this.formatDate2(ticket.issueDate, 'MMMM/Y').includes(
          searchTextLower
        ) ||
        this.formatDate2(ticket.expirationDate, 'MMMM/YY').includes(
          searchTextLower
        ) ||
        (!isNaN(searchNumber) && this.calculateTotal(ticket) === searchNumber)
    );
  }

  formatDate2(date: Date, format: string): string {
    const pad = (num: number) => (num < 10 ? '0' + num : num.toString());
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
    this.pagar();
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  isButtonInitialized: boolean = false;
  pagar() {
    this.requestData.idTicket = this.ticketSelectedModal.id;
    this.requestData.description = `Expensas de ${this.formatDate(
      this.ticketSelectedModal.issueDate
    )}`;
    this.requestData.title = `Expensas de ${this.formatDate(
      this.ticketSelectedModal.issueDate
    )} con vencimiento: ${this.formatDate(
      this.ticketSelectedModal.expirationDate
    )}`;
    this.requestData.totalPrice = this.calculateTotal(this.ticketSelectedModal);
    console.log(this.requestData);
    this.mercadopagoservice.crearPreferencia(this.requestData).subscribe(
      (response) => {
        console.log('Preferencia creada:', response);

        if (!this.isButtonInitialized) {
          this.mercadopagoservice.initMercadoPagoButton(response.id);
          this.isButtonInitialized = true;
        }

        // this.mercadopagoservice.initMercadoPagoButton(response.id);
      },
      (error) => {
        console.error('Error al crear la preferencia:', error);
      }
    );
  }
}
