import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { LedgerCriteriaComponent } from '../../user-interface/criteria/ledger-criteria.component'
import { LedgerListResolver } from '../resolvers/ledger-list.resolver'
import { LedgerCustomerListComponent } from '../../user-interface/list/customers/ledger-customer-list.component'

const routes: Routes = [
    { path: '', component: LedgerCriteriaComponent, canActivate: [AuthGuardService] },
    { path: 'list', component: LedgerCustomerListComponent, canActivate: [AuthGuardService], resolve: { ledgerList: LedgerListResolver }, runGuardsAndResolvers: 'always' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LedgerRoutingModule { }