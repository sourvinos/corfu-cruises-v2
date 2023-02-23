import { NgModule } from '@angular/core'
// Custom
import { PortFormComponent } from '../../user-interface/port-form.component'
import { PortListComponent } from '../../user-interface/port-list.component'
import { PortRoutingModule } from './port.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        PortListComponent,
        PortFormComponent
    ],
    imports: [
        SharedModule,
        PortRoutingModule
    ]
})

export class PortModule { }
