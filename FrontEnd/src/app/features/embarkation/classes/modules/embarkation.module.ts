import { NgModule } from '@angular/core'
// Custom
import { EmbarkationCriteriaComponent } from '../../user-interface/criteria/embarkation-criteria.component'
import { EmbarkationReservationsComponent } from '../../user-interface/list/reservations/embarkation-reservations.component'
import { EmbarkationPassengerListComponent } from '../../user-interface/list/passengers/embarkation-passengers.component'
import { EmbarkationRoutingModule } from './embarkation.routing.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        EmbarkationCriteriaComponent,
        EmbarkationReservationsComponent,
        EmbarkationPassengerListComponent
    ],
    imports: [
        SharedModule,
        EmbarkationRoutingModule
    ]
})

export class EmbarkationModule { }
