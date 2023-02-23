import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ShipCrewFormComponent } from '../../user-interface/shipCrew-form.component'
import { ShipCrewFormResolver } from '../resolvers/shipCrew-form.resolver'
import { ShipCrewListComponent } from '../../user-interface/shipCrew-list.component'
import { ShipCrewListResolver } from '../resolvers/shipCrew-list.resolver'

const routes: Routes = [
    { path: '', component: ShipCrewListComponent, canActivate: [AuthGuardService], resolve: { shipCrewList: ShipCrewListResolver } },
    { path: 'new', component: ShipCrewFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: ShipCrewFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { shipCrewForm: ShipCrewFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ShipCrewRoutingModule { }