import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { PickupPointFormComponent } from '../../user-interface/pickupPoint-form.component'
import { PickupPointFormResolver } from '../resolvers/pickupPoint-form.resolver'
import { PickupPointListComponent } from '../../user-interface/pickupPoint-list.component'
import { PickupPointListResolver } from '../resolvers/pickupPoint-list.resolver'

const routes: Routes = [
    { path: '', component: PickupPointListComponent, canActivate: [AuthGuardService], resolve: { pickupPointList: PickupPointListResolver } },
    { path: 'new', component: PickupPointFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: PickupPointFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { pickupPointForm: PickupPointFormResolver } },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PickupPointRoutingModule { }