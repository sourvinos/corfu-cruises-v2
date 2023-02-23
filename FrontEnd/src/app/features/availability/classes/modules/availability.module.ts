import { NgModule } from '@angular/core'
// Custom
import { AvailabilityComponent } from '../../user-interface/availability.component'
import { AvailabilityRoutingModule } from './availability.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        AvailabilityComponent
    ],
    imports: [
        SharedModule,
        AvailabilityRoutingModule
    ]
})

export class AvailabilityModule { }
