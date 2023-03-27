import { Component } from '@angular/core'
// Custom
import { MessageLabelService } from '../../services/message-label.service'
import { environment } from 'src/environments/environment'
import { ConnectedUser } from '../../classes/connected-user'

@Component({
    selector: 'cards-menu',
    templateUrl: './cards-menu.component.html',
    styleUrls: ['./cards-menu.component.css']
})

export class CardsMenuComponent {

    //#region variables

    public feature = 'cardsMenu'
    public imgIsLoaded = false

    //#endregion

    constructor(private messageLabelService: MessageLabelService) { }

    //#region public methods

    public getIcon(filename: string): string {
        return environment.featuresIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public imageIsLoading(): any {
        return this.imgIsLoaded ? '' : 'skeleton'
    }

    public isAdmin(): boolean {
        return ConnectedUser.isAdmin
    }

    public loadImage(): void {
        this.imgIsLoaded = true
    }

    //#endregion

}
