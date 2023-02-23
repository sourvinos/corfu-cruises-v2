import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { ShipRouteActiveVM } from '../view-models/shipRoute-active-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ShipRouteService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/shipRoutes')
    }

    //#region public methods

    public getActive(): Observable<ShipRouteActiveVM[]> {
        return this.http.get<ShipRouteActiveVM[]>(environment.apiUrl + '/shipRoutes/getActive')
    }

    //#endregion

}
