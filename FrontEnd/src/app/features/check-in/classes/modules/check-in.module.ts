import { NgModule } from '@angular/core'
// Custom
import { CheckInCriteriaComponent } from '../../user-interface/criteria/check-in-criteria.component'
import { CheckInPassengerFormComponent } from '../../user-interface/passenger-form/check-in-passenger-form.component'
import { CheckInPassengerListComponent } from '../../user-interface/passenger-list/check-in-passenger-list.component'
import { CheckInRoutingModule } from './check-in.routing.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        CheckInCriteriaComponent,
        CheckInPassengerListComponent,
        CheckInPassengerFormComponent
    ],
    imports: [
        SharedModule,
        CheckInRoutingModule
    ]
})

export class CheckInModule { }
