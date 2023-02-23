import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { CustomerFormComponent } from '../../user-interface/customer-form.component'
import { CustomerFormResolver } from '../resolvers/customer-form.resolver'
import { CustomerListComponent } from '../../user-interface/customer-list.component'
import { CustomerListResolver } from '../resolvers/customer-list.resolver'

const routes: Routes = [
    { path: '', component: CustomerListComponent, canActivate: [AuthGuardService], resolve: { customerList: CustomerListResolver } },
    { path: 'new', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { customerForm: CustomerFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CustomerRoutingModule { }