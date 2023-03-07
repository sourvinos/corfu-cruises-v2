import { Component } from '@angular/core'
// Custom
import { LogoService } from '../../reservations/classes/services/logo.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'login-logo',
    templateUrl: './login-logo.component.html',
    styleUrls: ['../../../shared/styles/login-forgot-reset-password-logo.css', './login-logo.component.css']
})

export class LoginLogoComponent {

    //#region variables

    public feature = 'loginForm'

    //#endregion

    constructor(private logoService: LogoService, private messageLabelService: MessageLabelService) { }

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getLogo(): string {
        return this.logoService.getLogo()
    }

    //#endregion

}
