import { NgModule } from '@angular/core'
// Custom
import { LoginFormComponent } from '../../user-interface/login-form.component'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        LoginFormComponent
    ],
    imports: [
        SharedModule
    ]
})

export class LoginModule { }
