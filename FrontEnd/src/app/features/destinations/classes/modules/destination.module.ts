import { NgModule } from '@angular/core'
// Custom
import { DestinationFormComponent } from '../../user-interface/destination-form.component'
import { DestinationListComponent } from '../../user-interface/destination-list.component'
import { DestinationRoutingModule } from './destination.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        DestinationListComponent,
        DestinationFormComponent
    ],
    imports: [
        SharedModule,
        DestinationRoutingModule
    ]
})

export class DestinationModule { }
