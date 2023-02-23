import { NgModule } from '@angular/core'
// Custom
import { SharedModule } from 'src/app/shared/modules/shared.module'
import { ShipOwnerFormComponent } from '../../user-interface/shipOwner-form.component'
import { ShipOwnerListComponent } from '../../user-interface/shipOwner-list.component'
import { ShipOwnerRoutingModule } from './shipOwner.routing.module'

@NgModule({
    declarations: [
        ShipOwnerListComponent,
        ShipOwnerFormComponent
    ],
    imports: [
        SharedModule,
        ShipOwnerRoutingModule
    ]
})

export class ShipOwnerModule { }
