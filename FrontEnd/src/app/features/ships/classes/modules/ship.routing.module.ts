import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ShipFormComponent } from '../../user-interface/ship-form.component'
import { ShipFormResolver } from '../resolvers/ship-form.resolver'
import { ShipListComponent } from '../../user-interface/ship-list.component'
import { ShipListResolver } from '../resolvers/ship-list.resolver'

const routes: Routes = [
    { path: '', component: ShipListComponent, canActivate: [AuthGuardService], resolve: { shipList: ShipListResolver } },
    { path: 'new', component: ShipFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: ShipFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { shipForm: ShipFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ShipRoutingModule { }