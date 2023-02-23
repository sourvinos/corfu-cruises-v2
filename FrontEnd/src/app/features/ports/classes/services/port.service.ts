import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'
import { PortActiveVM } from '../view-models/port-active-vm'

@Injectable({ providedIn: 'root' })

export class PortService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/ports')
    }

    //#region public methods

    public getActive(): Observable<PortActiveVM[]> {
        return this.http.get<PortActiveVM[]>(environment.apiUrl + '/ports/getActive')
    }

    //#endregion

}