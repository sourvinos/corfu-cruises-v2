import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { GenderFormComponent } from '../../user-interface/gender-form.component'
import { GenderFormResolver } from '../resolvers/gender-form.resolver'
import { GenderListComponent } from '../../user-interface/gender-list.component'
import { GenderListResolver } from '../resolvers/gender-list.resolver'

const routes: Routes = [
    { path: '', component: GenderListComponent, canActivate: [AuthGuardService], resolve: { genderList: GenderListResolver } },
    { path: 'new', component: GenderFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: GenderFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { genderForm: GenderFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class GenderRoutingModule { }