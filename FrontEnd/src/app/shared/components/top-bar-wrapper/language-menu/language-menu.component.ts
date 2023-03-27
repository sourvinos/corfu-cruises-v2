import { Component, HostListener } from '@angular/core'
// Custom
import { InteractionService } from '../../../services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from '../../../services/message-calendar.service'
import { MessageInputHintService } from 'src/app/shared/services/message-input-hint.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { MessageDialogService } from 'src/app/shared/services/message-dialog.service'

@Component({
    selector: 'language-menu',
    templateUrl: './language-menu.component.html',
    styleUrls: ['../../../../../assets/styles/dropdown-menu.css', './language-menu.component.css']
})

export class LanguageMenuComponent {

    //#region variables

    public imgIsLoaded = false

    //#endregion

    constructor(private interactionService: InteractionService, private localStorageStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageHintService: MessageInputHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService) { }

    //#region listeners

    @HostListener('mouseenter') onMouseEnter(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.remove('hidden')
        })
    }

    //#endregion

    //#region public methods

    public doLanguageTasks(language: string): string {
        this.saveLanguage(language)
        this.loadMessages()
        return language
    }

    public getStoredLanguage(): string {
        return this.localStorageStorageService.getItem('language') == '' ? this.doLanguageTasks('en-GB') : this.localStorageStorageService.getItem('language')
    }

    public hideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    public imageIsLoading(): any {
        return this.imgIsLoaded ? '' : 'skeleton'
    }

    public loadImage(): void {
        this.imgIsLoaded = true
    }

    //#endregion

    //#region private methods

    private loadMessages(): void {
        this.messageCalendarService.getMessages()
        this.messageHintService.getMessages()
        this.messageLabelService.getMessages()
        this.messageSnackbarService.getMessages()
        this.interactionService.updateDateAdapters()
        this.interactionService.updateMenus()
        this.interactionService.updateTabTitle()
    }

    private saveLanguage(language: string): void {
        this.localStorageStorageService.saveItem('language', language)
    }

    //#endregion

}
