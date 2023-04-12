import { Component } from '@angular/core'
import { Router } from '@angular/router'
// Customer
import { DestinationService } from '../../destinations/classes/services/destination.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { NationalityService } from '../../nationalities/classes/services/nationality.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
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

    constructor(private destinationService: DestinationService, private nationalityService: NationalityService, private messageLabelService: MessageLabelService, private router: Router, private sessionStorageService: SessionStorageService) {
        this.populateStorageFromAPI()
    }

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

    //#region private methods
 
    private populateStorageFromAPI(): void {
        this.destinationService.getActive().subscribe(response => { this.sessionStorageService.saveItem('destinations', JSON.stringify(response)) })
        this.nationalityService.getActive().subscribe(response => { this.sessionStorageService.saveItem('nationalities', JSON.stringify(response)) })
    }

    //#endregion

}