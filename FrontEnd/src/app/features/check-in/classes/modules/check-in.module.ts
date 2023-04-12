import { NgModule } from '@angular/core'
// Custom
import { CheckInCriteriaComponent } from '../../user-interface/criteria/check-in-criteria.component'
import { CheckInRoutingModule } from './check-in.routing.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        CheckInCriteriaComponent
    ],
    imports: [
        SharedModule,
        CheckInRoutingModule
    ]
})

export class CheckInModule { }
