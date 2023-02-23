import { NgModule } from '@angular/core'
// Custom
import { GenderFormComponent } from '../../user-interface/gender-form.component'
import { GenderListComponent } from '../../user-interface/gender-list.component'
import { GenderRoutingModule } from './gender.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        GenderListComponent,
        GenderFormComponent
    ],
    imports: [
        SharedModule,
        GenderRoutingModule
    ]
})

export class GenderModule { }
