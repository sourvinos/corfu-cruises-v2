import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
// Custom
import { LocalStorageService } from './local-storage.service'

@Injectable({ providedIn: 'root' })

export class MessageHintService {

    //#region variables

    private messages: any = []

    //#endregion

    constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {
        this.getMessages()
    }

    //#region public methods

    public getDescription(id: string, stringLength = 0): string {
        let returnValue = ''
        if (this.messages.labels != undefined) {
            this.messages.labels.filter((l: { id: string; description: string }) => {
                if (l.id == id) {
                    returnValue = l.description.replace('xx', stringLength.toString())
                }
            })
        }
        return returnValue
    }

    public getMessages(): Promise<any> {
        const promise = new Promise((resolve) => {
            firstValueFrom(this.httpClient.get('assets/languages/hint/hint.' + this.localStorageService.getLanguage() + '.json')).then(response => {
                this.messages = response
                resolve(this.messages)
            })
        })
        return promise
    }

    //#endregion

}

