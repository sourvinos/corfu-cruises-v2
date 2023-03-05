import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
// Custom
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Injectable({ providedIn: 'root' })

export class MessageMenuService {

    //#region variables

    private messages: any = []

    //#endregion

    constructor(private httpClient: HttpClient, private sessionStorageService: SessionStorageService) { }

    //#region public methods

    public getDescription(response: any[], id: string): string {
        let returnValue = ''
        if (response != undefined) {
            response.filter((f) => {
                if (f.id === id) {
                    returnValue = f.description
                }
            })
        }
        return returnValue
    }

    public getMessages(): Promise<any> {
        const promise = new Promise((resolve) => {
            firstValueFrom(this.httpClient.get('assets/languages/menu/menu.' + this.sessionStorageService.getLanguage() + '.json')).then(response => {
                this.messages = response
                resolve(this.messages)
            })
        })
        return promise
    }

    //#endregion

}

