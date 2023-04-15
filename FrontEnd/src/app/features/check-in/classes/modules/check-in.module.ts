import { NgModule } from '@angular/core'
// Custom
import { CheckInCriteriaComponent } from '../../user-interface/criteria/check-in-criteria.component'
import { CheckInReservationFormComponent } from '../../user-interface/reservation/check-in-reservation-form.component'
import { CheckInRoutingModule } from './check-in.routing.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        CheckInCriteriaComponent,
        CheckInReservationFormComponent,
    ],
    imports: [
        SharedModule,
        CheckInRoutingModule
    ]
})

export class CheckInModule { }
