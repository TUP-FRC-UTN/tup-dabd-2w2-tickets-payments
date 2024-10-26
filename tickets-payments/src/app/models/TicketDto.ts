// export interface TicketDetail {
//     id: number;
//     name: string;
//     description: string;
//     quantity: number;
//     price: number; 
//   }
  
//   export enum TicketStatus {
//     PENDING = 'PENDING',
//     PAID = 'PAID',
//     CANCELED = 'CANCELED'
//   }
  
//   export interface TicketDto {
  
//     id: number;
  
//     owner_id: number;
  
//     emision_date: Date;
  
//     expiration_date: Date;

//     status: TicketStatus;
  
//     items: TicketDetail[];
//   }
export interface TicketDetail {
  id: number;
  description: string;  // Cambiado de 'name'
  amount: number;       // Cambiado de 'price', eliminando 'quantity'
}

export enum TicketStatus {
  PENDING = 'PENDIENTE',
  PAID = 'PAGADO',
  CANCELED = 'CANCELED'
}

export interface TicketDto {
  id: number;                   // Cambiado de 'ticketNumber'
  ownerId: number;               // Cambiado de 'owner_id'
  issueDate: Date;               // Cambiado de 'emision_date'
  expirationDate: Date;          // Cambiado de 'expiration_date'
  status: TicketStatus;
  ticketDetails: TicketDetail[]; // Cambiado de 'items'
}
