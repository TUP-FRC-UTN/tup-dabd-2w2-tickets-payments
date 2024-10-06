export interface TicketDetail {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number; 
  }
  
  export enum TicketStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELED = 'CANCELED'
  }
  
  export interface TicketDto {
  
    id: number;
  
    owner_id: number;
  
    emision_date: Date;
  
    expiration_date: Date;

    status: TicketStatus;
  
    items: TicketDetail[];
  }
  