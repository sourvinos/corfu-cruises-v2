import { NgModule } from '@angular/core'
// Custom
import { ScheduleEditFormComponent } from '../../user-interface/edit/schedule-edit-form.component'
import { ScheduleListComponent } from '../../user-interface/list/schedule-list.component'
import { ScheduleNewFormComponent } from '../../user-interface/new/schedule-new-form.component'
import { ScheduleRoutingModule } from './schedule.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        ScheduleListComponent,
        ScheduleNewFormComponent,
        ScheduleEditFormComponent
    ],
    imports: [
        ScheduleRoutingModule,
        SharedModule,
    ]
})

export class ScheduleModule { }
