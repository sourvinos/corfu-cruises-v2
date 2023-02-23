import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { DestinationActiveVM } from '../view-models/destination-active-vm'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class DestinationService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/destinations')
    }

    //#region public methods

    public getActive(): Observable<DestinationActiveVM[]> {
        return this.http.get<DestinationActiveVM[]>(environment.apiUrl + '/destinations/getActive')
    }

    //#endregion

}
