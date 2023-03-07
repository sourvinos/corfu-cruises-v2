import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ScheduleEditFormComponent } from '../../user-interface/edit/schedule-edit-form.component'
import { ScheduleEditFormResolver } from '../resolvers/schedule-edit-form.resolver'
import { ScheduleListComponent } from '../../user-interface/list/schedule-list.component'
import { ScheduleListResolver } from '../resolvers/schedule-list.resolver'
import { ScheduleNewFormComponent } from '../../user-interface/new/schedule-new-form.component'

const routes: Routes = [
    { path: '', component: ScheduleListComponent, canActivate: [AuthGuardService], resolve: { scheduleList: ScheduleListResolver } },
    { path: 'new', component: ScheduleNewFormComponent, canActivate: [AuthGuardService] },
    { path: ':id', component: ScheduleEditFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { scheduleEditForm: ScheduleEditFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ScheduleRoutingModule { }