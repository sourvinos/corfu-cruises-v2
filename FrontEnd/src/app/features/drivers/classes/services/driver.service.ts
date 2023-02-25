import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DriverActiveVM } from './../view-models/driver-active-vm'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class DriverService extends HttpDataService {

    constructor(httpClient: HttpClient, private localStorageService: LocalStorageService) {
        super(httpClient, environment.apiUrl + '/drivers')
    }

    //#region public methods

    getActive(): Observable<DriverActiveVM[]> {
        return this.http.get<DriverActiveVM[]>(environment.apiUrl + '/drivers/getActive')
    }

    getActiveFromStorage(): DriverActiveVM[] {
        return JSON.parse(this.localStorageService.getItem('ships'))
    }

    //#endregion

}
