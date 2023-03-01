import { NgModule } from '@angular/core'
// Custom
import { CalendarComponent } from '../../user-interface/calendar/calendar.component'
import { PassengerFormComponent } from '../../user-interface/passenger-form/passenger-form.component'
import { PassengerListComponent } from '../../user-interface/passenger-list/passenger-list.component'
import { ReservationFormComponent } from '../../user-interface/reservation-form/reservation-form.component'
import { ReservationListComponent } from '../../user-interface/reservation-list/reservation-list.component'
import { ReservationRoutingModule } from './reservation.routing.module'
import { ReservationToDriverComponent } from './../../user-interface/reservation-to-driver/reservation-to-driver-form.component'
import { ReservationToShipComponent } from '../../user-interface/reservation-to-ship/reservation-to-ship-form.component'
import { SharedModule } from '../../../../shared/modules/shared.module'
import { StoredPassengersModalComponent } from '../../user-interface/stored-passengers/stored-passengers-modal.component'

@NgModule({
    declarations: [
        CalendarComponent,
        PassengerFormComponent,
        PassengerListComponent,
        ReservationFormComponent,
        ReservationListComponent,
        ReservationToDriverComponent,
        ReservationToShipComponent,
        StoredPassengersModalComponent,
    ],
    imports: [
        SharedModule,
        ReservationRoutingModule
    ],
    entryComponents: [
        ReservationToDriverComponent,
        ReservationToShipComponent
    ]
})

export class ReservationModule { }
