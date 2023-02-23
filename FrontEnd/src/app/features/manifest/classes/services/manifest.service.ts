import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ManifestService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/manifest')
    }

    public get(date: string, destinationId: number, shipId: number, portIds: number[]): Observable<any> {
        return this.http.get<any>(this.url + '?date=' + date + '&destinationId=' + destinationId + '&shipId=' + shipId + this.buildPortsQuery(portIds))
    }

    private buildPortsQuery(portIds: number[]): string {
        let query = ''
        portIds.forEach(portId => {
            query += '&portId=' + portId
        })
        return query
    }

}
