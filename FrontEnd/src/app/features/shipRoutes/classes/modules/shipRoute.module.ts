import { NgModule } from '@angular/core'
// Custom
import { SharedModule } from '../../../../shared/modules/shared.module'
import { ShipRouteFormComponent } from '../../user-interface/shipRoute-form.component'
import { ShipRouteListComponent } from '../../user-interface/shipRoute-list.component'
import { ShipRouteRoutingModule } from './shipRoute.routing.module'

@NgModule({
    declarations: [
        ShipRouteListComponent,
        ShipRouteFormComponent
    ],
    imports: [
        SharedModule,
        ShipRouteRoutingModule
    ]
})

export class ShipRouteModule { }
