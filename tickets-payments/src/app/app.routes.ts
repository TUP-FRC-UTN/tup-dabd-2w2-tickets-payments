import { Routes } from '@angular/router';
import { AdminListExpensasComponent } from './admin-list-expensas/admin-list-expensas.component';
import { OwnerListExpensasComponent } from './owner-list-expensas/owner-list-expensas.component';

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
        path: '**',
        component: OwnerListExpensasComponent
    }
];
