import { NgModule } from '@angular/core'
// Custom
import { PickupPointFormComponent } from '../../user-interface/pickupPoint-form.component'
import { PickupPointListComponent } from '../../user-interface/pickupPoint-list.component'
import { PickupPointRoutingModule } from './pickupPoint.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        PickupPointListComponent,
        PickupPointFormComponent,
    ],
    imports: [
        SharedModule,
        PickupPointRoutingModule
    ]
})

export class PickupPointModule { }
