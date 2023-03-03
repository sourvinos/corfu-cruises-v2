import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { EmbarkationReservationVM } from '../view-models/list/embarkation-reservation-vm'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class EmbarkationService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/embarkation')
    }

    get(date: string, destinationIds: number[], portIds: number[], shipIds: number[]): Observable<EmbarkationReservationVM> {
        return this.http.get<any>(
            this.url + '?date=' + date
            + this.buildDestinationsQuery(destinationIds)
            + this.buildPortsQuery(portIds)
            + this.buildShipsQuery(shipIds))
    }

    embarkSinglePassenger(id: number): Observable<any> {
        const params = new HttpParams().set('id', id)
        return this.http.patch(this.url + '/embarkPassenger?', null, { params: params })
    }

    embarkPassengers(ignoreCurrentStatus: boolean, id: number[]): Observable<any> {
        let params = new HttpParams().set('ignoreCurrentStatus', ignoreCurrentStatus)
        params = params.append('id', id[0])
        id.forEach((element, index) => {
            if (index > 0) {
                params = params.append('id', element)
            }
        })
        return this.http.patch(this.url + '/embarkPassengers?', null, { params: params })
    }

    private buildDestinationsQuery(destinationIds: number[]): string {
        let query = ''
        destinationIds.forEach(destinationId => {
            query += '&destinationId=' + destinationId
        })
        return query
    }

    private buildPortsQuery(portIds: number[]): string {
        let query = ''
        portIds.forEach(portId => {
            query += '&portId=' + portId
        })
        return query
    }

    private buildShipsQuery(shipIds: number[]): string {
        let query = ''
        shipIds.forEach(shipId => {
            query += '&shipId=' + shipId
        })
        return query
    }

}
