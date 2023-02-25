import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { ShipActiveVM } from 'src/app/features/ships/classes/view-models/ship-active-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ShipService extends HttpDataService {

    constructor(httpClient: HttpClient, private localStorageService: LocalStorageService) {
        super(httpClient, environment.apiUrl + '/ships')
    }

    //#region public methods

    getActive(): Observable<ShipActiveVM[]> {
        return this.http.get<ShipActiveVM[]>(environment.apiUrl + '/ships/getActive')
    }

    getActiveFromStorage(): ShipActiveVM[] {
        return JSON.parse(this.localStorageService.getItem('ships'))
    }

    //#endregion

}
