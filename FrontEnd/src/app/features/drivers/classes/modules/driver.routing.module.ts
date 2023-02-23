import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { DriverFormComponent } from '../../user-interface/driver-form.component'
import { DriverFormResolver } from '../resolvers/driver-form.resolver'
import { DriverListComponent } from '../../user-interface/driver-list.component'
import { DriverListResolver } from '../resolvers/driver-list.resolver'

const routes: Routes = [
    { path: '', component: DriverListComponent, canActivate: [AuthGuardService], resolve: { driverList: DriverListResolver } },
    { path: 'new', component: DriverFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: DriverFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { driverForm: DriverFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DriverRoutingModule { }