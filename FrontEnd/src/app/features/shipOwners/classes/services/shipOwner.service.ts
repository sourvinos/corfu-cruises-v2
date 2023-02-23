import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { ShipOwnerActiveVM } from '../view-models/shipOwner-active-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ShipOwnerService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/shipOwners')
    }

    public getActive(): Observable<ShipOwnerActiveVM[]> {
        return this.http.get<ShipOwnerActiveVM[]>(environment.apiUrl + '/shipOwners/getActive')
    }

}
