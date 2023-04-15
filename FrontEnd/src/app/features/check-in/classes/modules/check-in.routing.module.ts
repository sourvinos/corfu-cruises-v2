import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { CheckInCriteriaComponent } from '../../user-interface/criteria/check-in-criteria.component'
import { CheckInReservationFormComponent } from '../../user-interface/reservation/check-in-reservation-form.component'

const routes: Routes = [
    { path: '', component: CheckInCriteriaComponent },
    { path: ':id', component: CheckInReservationFormComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CheckInRoutingModule { }