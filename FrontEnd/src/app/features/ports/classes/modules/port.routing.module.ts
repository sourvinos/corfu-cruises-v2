import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { PortFormComponent } from '../../user-interface/port-form.component'
import { PortFormResolver } from '../resolvers/port-form.resolver'
import { PortListComponent } from '../../user-interface/port-list.component'
import { PortListResolver } from '../resolvers/port-list.resolver'

const routes: Routes = [
    { path: '', component: PortListComponent, canActivate: [AuthGuardService], resolve: { portList: PortListResolver } },
    { path: 'new', component: PortFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: PortFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { portForm: PortFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PortRoutingModule { }