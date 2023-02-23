import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { AvailabilityCalendarResolver } from '../resolvers/availability-calendar.resolver'
import { AvailabilityComponent } from '../../user-interface/availability.component'

const routes: Routes = [
    { path: '', component: AvailabilityComponent, canActivate: [AuthGuardService], resolve: { availabilityCalendar: AvailabilityCalendarResolver }, runGuardsAndResolvers: 'always' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AvailabilityRoutingModule { }