import { NgModule } from '@angular/core'
// Custom
import { CoachRouteFormComponent } from '../../user-interface/form/coachRoute-form.component'
import { CoachRouteListComponent } from '../../user-interface/list/coachRoute-list.component'
import { CoachRouteRoutingModule } from './coachRoute.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        CoachRouteListComponent,
        CoachRouteFormComponent
    ],
    imports: [
        SharedModule,
        CoachRouteRoutingModule
    ]
})

export class CoachRouteModule { }
