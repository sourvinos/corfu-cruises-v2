import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class LocalStorageService {

    //#region public methods

    public clearSessionStorage(list: any, key: any): void {
        if (key == 'all') {
            sessionStorage.removeItem(list)
        }
        if (key == 'selected-rows') {
            const x = JSON.parse(sessionStorage.getItem(list))
            x.selection = null
            sessionStorage.setItem(list, JSON.stringify(x))
        }
    }

    public getItem(item: string): string {
        return localStorage.getItem(item) || ''
    }

    public getFilters(filterName: string): any {
        const x = this.getItem(filterName)
        if (x != '' && x.length != 2) {
            return JSON.parse(this.getItem(filterName))
        }
    }

    public getLanguage(): string {
        const language = localStorage.getItem('language')
        if (language == null) {
            localStorage.setItem('language', environment.defaultLanguage)
            return environment.defaultLanguage
        }
        return language
    }

    public saveItem(key: string, value: string): void {
        localStorage.setItem(key, value)
    }

    public deleteItems(items: any): void {
        items.forEach((element: { when: string; item: string }) => {
            if (element.when == 'always' || environment.production) {
                localStorage.removeItem(element.item)
            }
        })
    }

    //#endregion

}
