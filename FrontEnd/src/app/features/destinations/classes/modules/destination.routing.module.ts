import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { DestinationFormComponent } from '../../user-interface/destination-form.component'
import { DestinationFormResolver } from '../resolvers/destination-form.resolver'
import { DestinationListComponent } from '../../user-interface/destination-list.component'
import { DestinationListResolver } from '../resolvers/destination-list.resolver'

const routes: Routes = [
    { path: '', component: DestinationListComponent, canActivate: [AuthGuardService], resolve: { destinationList: DestinationListResolver } },
    { path: 'new', component: DestinationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: DestinationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { destinationForm: DestinationFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DestinationRoutingModule { }