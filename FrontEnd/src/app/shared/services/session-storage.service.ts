import { Injectable } from '@angular/core'
// Custom
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class SessionStorageService {

    //#region public methods

    public deleteItems(items: any): void {
        items.forEach((element: { when: string; item: string }) => {
            if (element.when == 'always' || environment.production) {
                sessionStorage.removeItem(element.item)
            }
        })
    }

    //#endregion

}
