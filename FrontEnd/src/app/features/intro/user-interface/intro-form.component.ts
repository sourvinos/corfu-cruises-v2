import { Component } from '@angular/core'
import { Router } from '@angular/router'
// Customer
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'intro-form',
    templateUrl: './intro-form.component.html',
    styleUrls: ['../../../shared/styles/login-forgot-reset-password.css', './intro-form.component.css']
})

export class IntroFormComponent {

    //#region variables

    public feature = 'cardsMenu'
    public imgIsLoaded = false

    //#endregion

    constructor(private messageLabelService: MessageLabelService, private router: Router) { }

    //#region public methods
    public onLogin(): void {
        this.router.navigate(['/login'])
    }

    public getIcon(filename: string): string {
        return environment.featuresIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public imageIsLoading(): any {
        return this.imgIsLoaded ? '' : 'skeleton'
    }

    public loadImage(): void {
        this.imgIsLoaded = true
    }

    //#endregion

}