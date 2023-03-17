import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class InteractionService {

    private _refreshDateAdapter = new Subject<any>()
    private _refreshMenus = new Subject<any>()
    private _refreshTabTitle = new Subject<any>()

    public refreshDateAdapter = this._refreshDateAdapter.asObservable()
    public refreshMenus = this._refreshMenus.asObservable()
    public refreshTabTitle = this._refreshTabTitle.asObservable()

    public updateDateAdapters(): void {
        setTimeout(() => {
            this._refreshDateAdapter.next(null)
        }, 1000)
    }

    public updateMenus(): void {
        setTimeout(() => {
            this._refreshMenus.next(null)
        }, 0)
    }

    public updateTabTitle(): void {
        setTimeout(() => {
            this._refreshTabTitle.next(null)
        }, 500)
    }

}
