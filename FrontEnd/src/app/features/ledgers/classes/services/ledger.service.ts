import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { LedgerVM } from '../view-models/list/ledger-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class LedgerService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/ledgers')
    }

    get(fromDate: string, toDate: string, destinationIds: number[], shipIds: number[]): Observable<LedgerVM> {
        return this.http.get<LedgerVM>(
            this.url + '?fromDate=' + fromDate + '&toDate=' + toDate +
            this.buildDestinationsQuery(destinationIds) +
            this.buildShipsQuery(shipIds))
    }

    private buildDestinationsQuery(destinationIds: number[]): string {
        let query = ''
        destinationIds.forEach(destinationId => {
            query += '&destinationId=' + destinationId
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
