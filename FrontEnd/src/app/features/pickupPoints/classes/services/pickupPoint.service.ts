import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { PickupPointActiveVM } from '../view-models/pickupPoint-active-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class PickupPointService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/pickupPoints')
    }

    getActive(): Observable<PickupPointActiveVM[]> {
        return this.http.get<PickupPointActiveVM[]>(environment.apiUrl + '/pickupPoints/getActive')
    }

    updateCoordinates(pickupPointId: string, coordinates: string): Observable<any> {
        const params = new HttpParams().set('pickupPointId', pickupPointId).set('coordinates', coordinates)
        return this.http.patch(this.url + '/updateCoordinates?', null, { params: params })
    }

}
