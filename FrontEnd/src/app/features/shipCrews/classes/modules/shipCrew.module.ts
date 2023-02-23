import { NgModule } from '@angular/core'
// Custom
import { SharedModule } from '../../../../shared/modules/shared.module'
import { ShipCrewFormComponent } from '../../user-interface/shipCrew-form.component'
import { ShipCrewListComponent } from '../../user-interface/shipCrew-list.component'
import { ShipCrewRoutingModule } from './shipCrew.routing.module'

@NgModule({
    declarations: [
        ShipCrewListComponent,
        ShipCrewFormComponent
    ],
    imports: [
        SharedModule,
        ShipCrewRoutingModule
    ]
})

export class ShipCrewModule { }
