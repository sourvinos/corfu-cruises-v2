import { Component } from '@angular/core'
// Custom
import { ConnectedUser } from '../../classes/connected-user'
import { DialogService } from '../../services/dialog.service'
import { MessageLabelService } from '../../services/message-label.service'
import { environment } from 'src/environments/environment'
import { MessageDialogService } from '../../services/message-dialog.service'

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

    constructor(private dialogService: DialogService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService) { }

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

    public notAvailable(): void {
        this.dialogService.open(this.messageSnackbarService.featureNotAvailable(), 'error', ['ok'])
    }

    //#endregion

}
