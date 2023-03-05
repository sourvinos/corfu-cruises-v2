import { Injectable } from '@angular/core'
// Custom
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class SessionStorageService {

    //#region public methods

    public getItem(item: string): string {
        return sessionStorage.getItem(item) || ''
    }

    public getFilters(filterName: string): any {
        const x = this.getItem(filterName)
        if (x != '' && x.length != 2) {
            return JSON.parse(this.getItem(filterName))
        }
    }

    public getLanguage(): string {
        const language = sessionStorage.getItem('language')
        if (language == null) {
            sessionStorage.setItem('language', environment.defaultLanguage)
            return environment.defaultLanguage
        }
        return language
    }

    public saveItem(key: string, value: string): void {
        sessionStorage.setItem(key, value)
    }

    public deleteItems(items: any): void {
        items.forEach((element: { when: string; item: string }) => {
            if (element.when == 'always' || environment.production) {
                sessionStorage.removeItem(element.item)
            }
        })
    }

    //#endregion

}
