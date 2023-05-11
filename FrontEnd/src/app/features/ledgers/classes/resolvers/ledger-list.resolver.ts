import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { LedgerListResolved } from './ledger-list-resolved'
import { LedgerSearchCriteria } from '../view-models/criteria/ledger-search-criteria'
import { LedgerService } from '../services/ledger.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Injectable({ providedIn: 'root' })

export class LedgerListResolver {

    constructor(private ledgerService: LedgerService, private sessionStorageService: SessionStorageService) { }

    resolve(): Observable<LedgerListResolved> {
        const storedCriteria = JSON.parse(this.sessionStorageService.getItem('ledger-criteria'))
        const searchCriteria: LedgerSearchCriteria = {
            fromDate: storedCriteria.fromDate,
            toDate: storedCriteria.toDate,
            destinationIds: this.buildIds(storedCriteria.destinations),
            portIds: this.buildIds(storedCriteria.ports),
            shipIds: this.buildIds(storedCriteria.ships)
        }
        return this.ledgerService.get(searchCriteria).pipe(
            map((ledgerList) => new LedgerListResolved(ledgerList)),
            catchError((err: any) => of(new LedgerListResolved(null, err)))
        )
    }

    private buildIds(criteria: any): number[] {
        const ids = []
        criteria.forEach((element: { id: any }) => {
            ids.push(parseInt(element.id))
        })
        return ids
    }

}
