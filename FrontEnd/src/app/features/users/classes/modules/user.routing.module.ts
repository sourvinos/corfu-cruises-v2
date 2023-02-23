import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ChangePasswordFormComponent } from '../../user-interface/change-password/change-password-form.component'
import { EditUserFormComponent } from '../../user-interface/edit/edit-user-form.component'
import { ForgotPasswordFormComponent } from '../../user-interface/forgot-password/forgot-password-form.component'
import { NewUserFormComponent } from '../../user-interface/new/new-user-form.component'
import { ResetPasswordFormComponent } from '../../user-interface/reset-password/reset-password-form.component'
import { UserEditFormResolver } from '../resolvers/user-edit-form.resolver'
import { UserListComponent } from '../../user-interface/list/user-list.component'
import { UserListResolver } from '../resolvers/user-list.resolver'

const routes: Routes = [
    { path: '', component: UserListComponent, canActivate: [AuthGuardService], resolve: { userList: UserListResolver } },
    { path: 'new', component: NewUserFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: EditUserFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { userEditForm: UserEditFormResolver } },
    { path: ':id/changePassword', component: ChangePasswordFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: 'forgotPassword', component: ForgotPasswordFormComponent },
    { path: 'resetPassword', component: ResetPasswordFormComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UserRoutingModule { }