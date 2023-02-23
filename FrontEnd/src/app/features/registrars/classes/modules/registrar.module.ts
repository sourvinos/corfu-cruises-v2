import { NgModule } from '@angular/core'
// Custom
import { RegistrarRoutingModule } from './registrar.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'
import { RegistrarFormComponent } from '../../user-interface/registrar-form.component'
import { RegistrarListComponent } from '../../user-interface/registrar-list.component'

@NgModule({
    declarations: [
        RegistrarListComponent,
        RegistrarFormComponent
    ],
    imports: [
        SharedModule,
        RegistrarRoutingModule
    ]
})

export class RegistrarModule { }
