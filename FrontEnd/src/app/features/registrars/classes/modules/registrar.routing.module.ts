import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { RegistrarFormComponent } from '../../user-interface/registrar-form.component'
import { RegistrarFormResolver } from '../resolvers/registrar-form.resolver'
import { RegistrarListComponent } from '../../user-interface/registrar-list.component'
import { RegistrarListResolver } from '../resolvers/registrar-list.resolver'

const routes: Routes = [
    { path: '', component: RegistrarListComponent, canActivate: [AuthGuardService], resolve: { registrarList: RegistrarListResolver } },
    { path: 'new', component: RegistrarFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: RegistrarFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { registrarForm: RegistrarFormResolver } }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RegistrarRoutingModule { }