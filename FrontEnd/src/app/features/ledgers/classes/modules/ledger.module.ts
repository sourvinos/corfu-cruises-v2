import { NgModule } from '@angular/core'
// Custom
import { LedgerCriteriaComponent } from '../../user-interface/criteria/ledger-criteria.component'
import { LedgerCustomerListComponent } from '../../user-interface/list/customers/ledger-customer-list.component'
import { LedgerCustomerReservationListComponent } from '../../user-interface/list/reservations/ledger-reservations.component'
import { LedgerCustomerSummaryComponent } from '../../user-interface/list/summary/ledger-summary.component'
import { LedgerRoutingModule } from './ledger.routing.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        LedgerCriteriaComponent,
        LedgerCustomerListComponent,
        LedgerCustomerReservationListComponent,
        LedgerCustomerSummaryComponent
    ],
    imports: [
        SharedModule,
        LedgerRoutingModule
    ]
})

export class LedgerModule { }
