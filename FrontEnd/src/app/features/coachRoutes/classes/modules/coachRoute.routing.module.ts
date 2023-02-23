import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { CoachRouteFormComponent } from '../../user-interface/form/coachRoute-form.component'
import { CoachRouteListComponent } from '../../user-interface/list/coachRoute-list.component'
import { CoachRouteListResolver } from '../resolvers/coachRoute-list.resolver'
import { RouteFormResolver } from '../resolvers/coachRoute-form.resolver'

const routes: Routes = [
    { path: '', component: CoachRouteListComponent, canActivate: [AuthGuardService], resolve: { coachRouteList: CoachRouteListResolver } },
    { path: 'new', component: CoachRouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: CoachRouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { coachRouteForm: RouteFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CoachRouteRoutingModule { }