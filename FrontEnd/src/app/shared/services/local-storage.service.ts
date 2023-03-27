import { Injectable } from '@angular/core'
// Custom
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class LocalStorageService {

    public getItem(item: string): string {
        return localStorage.getItem(item) || ''
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

}
