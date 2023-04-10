import { NgModule } from '@angular/core'
// Custom
import { IntroFormComponent } from '../../user-interface/intro-form.component'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        IntroFormComponent
    ],
    imports: [
        SharedModule
    ]
})

export class IntroModule { }
