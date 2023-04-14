import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
// Custom
import { LocalStorageService } from './local-storage.service'

@Injectable({ providedIn: 'root' })

export class MessageDialogService {

    //#region variables

    private messages: any = []
    private feature = 'snackbarMessages'

    //#endregion

    constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {
        this.getMessages()
    }

    //#region public methods

    public getDescription(feature: string, id: string, stringLength = 0): string {
        let returnValue = ''
        if (this.messages != undefined) {
            this.messages.filter((f: { feature: string; labels: any[] }) => {
                if (f.feature === feature) {
                    f.labels.filter(l => {
                        if (l.id == id) {
                            returnValue = l.message.replace('xx', stringLength.toString())
                        }
                    })
                }
            })
        }
        return returnValue
    }

    public getMessages(): Promise<any> {
        const promise = new Promise((resolve) => {
            firstValueFrom(this.httpClient.get('assets/languages/snackbar/snackbar.' + this.localStorageService.getLanguage() + '.json')).then(response => {
                this.messages = response
                resolve(this.messages)
            })
        })
        return promise
    }

    public accountNotConfirmed(): string { return this.getDescription(this.feature, 'accountNotConfirmed') }
    public authenticationFailed(): string { return this.getDescription(this.feature, 'authenticationFailed') }
    public emailSent(): string { return this.getDescription(this.feature, 'emailSent') }
    public emailNotSent(): string { return this.getDescription(this.feature, 'emailNotSent') }
    public formIsDirty(): string { return this.getDescription(this.feature, 'formIsDirty') }
    public noVideoDevicesFound(): string { return this.getDescription(this.feature, 'noVideoDevicesFound') }
    public noRecordsSelected(): string { return this.getDescription(this.feature, 'noRecordsSelected') }
    public reservationCreated(): string { return this.getDescription(this.feature, 'reservationCreated') }
    public unableToResetPassword(): string { return this.getDescription(this.feature, 'unableToResetPassword') }
    public invalidModel(): string { return this.getDescription(this.feature, 'invalidModel') }
    public passwordCanBeChangedOnlyByAccountOwner(): string { return this.getDescription(this.feature, 'passwordCanBeChangedOnlyByAccountOwner') }
    public noContactWithServer(): string { return this.getDescription(this.feature, 'noContactWithServer') }
    public featureNotAvailable(): string { return this.getDescription(this.feature, 'featureNotAvailable') }
    public success(): string { return this.getDescription(this.feature, 'success') }
    public confirmDelete(): string { return this.getDescription(this.feature, 'warning') }
    public askToRefreshCalendar(): string { return this.getDescription(this.feature, 'askToRefreshCalendar') }
    public resolutionWarning(): string { return this.getDescription(this.feature, 'resolutionWarning') }
    public reservationFound(): string { return this.getDescription(this.feature, 'reservationFound') }
    public reservationNotFound(): string { return this.getDescription(this.feature, 'reservationNotFound') }
    public helpDialog(): string { return this.getDescription(this.feature, 'helpDialog') }

    public filterResponse(error: any, feature = 'snackbarMessages'): string {
        let returnValue = ''
        this.messages.filter((f: { feature: string; labels: any[] }) => {
            if (f.feature === feature) {
                f.labels.filter(l => {
                    if (l.error == parseInt(error.message)) {
                        returnValue = l.message
                    }
                })
            }
        })
        return returnValue
    }

}