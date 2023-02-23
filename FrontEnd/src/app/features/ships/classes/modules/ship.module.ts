import { NgModule } from '@angular/core'
// Custom
import { SharedModule } from '../../../../shared/modules/shared.module'
import { ShipFormComponent } from '../../user-interface/ship-form.component'
import { ShipListComponent } from '../../user-interface/ship-list.component'
import { ShipRoutingModule } from './ship.routing.module'

@NgModule({
    declarations: [
        ShipListComponent,
        ShipFormComponent
    ],
    imports: [
        SharedModule,
        ShipRoutingModule
    ]
})

export class ShipModule { }
