import { Routes } from '@angular/router';
import { AdminListExpensasComponent } from './admin-list-expensas/admin-list-expensas.component';
import { OwnerListExpensasComponent } from './owner-list-expensas/owner-list-expensas.component';
import { StadisticsComponent } from './stadistics/stadistics.component';
import { ReviewTicketsTransferComponent } from './review-tickets-transfer/review-tickets-transfer.component';

export const routes: Routes = [
    {
        path: 'admin-list-expensas',
        component: AdminListExpensasComponent
    },
    {
        path: 'owner-list-expensas',
        component: OwnerListExpensasComponent
    },
    {
        path: 'stadistics',
        component: StadisticsComponent
    },
    {
        path: 'review-tickets-transfer',
        component: ReviewTicketsTransferComponent
    },
    {
        path: '**',
        component: OwnerListExpensasComponent
    }
];
