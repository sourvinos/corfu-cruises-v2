import { Injectable } from '@angular/core'
// Custom
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class SessionStorageService {

    public getItem(item: string): string {
        return sessionStorage.getItem(item) || ''
    }

    public getFilters(filterName: string): any {
        const x = this.getItem(filterName)
        if (x != '' && x.length != 2) {
            return JSON.parse(this.getItem(filterName))
        }
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

}
