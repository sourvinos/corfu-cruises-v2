import { NgModule } from '@angular/core'
// Custom
import { ChangePasswordFormComponent } from '../../user-interface/change-password/change-password-form.component'
import { EditUserFormComponent } from '../../user-interface/edit/edit-user-form.component'
import { ForgotPasswordFormComponent } from '../../user-interface/forgot-password/forgot-password-form.component'
import { NewUserFormComponent } from '../../user-interface/new/new-user-form.component'
import { ResetPasswordFormComponent } from '../../user-interface/reset-password/reset-password-form.component'
import { SharedModule } from '../../../../shared/modules/shared.module'
import { UserListComponent } from '../../user-interface/list/user-list.component'
import { UserRoutingModule } from './user.routing.module'

@NgModule({
    declarations: [
        UserListComponent,
        NewUserFormComponent,
        EditUserFormComponent,
        ForgotPasswordFormComponent,
        ResetPasswordFormComponent,
        ChangePasswordFormComponent,
    ],
    imports: [
        SharedModule,
        UserRoutingModule
    ]
})

export class UserModule { }
