import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { LedgerStoredCriteriaVM } from '../view-models/criteria/ledger-stored-criteria-vm'
import { LedgerListResolved } from './ledger-list-resolved'
import { LedgerService } from '../services/ledger.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { LedgerSearchCriteriaVM } from '../view-models/criteria/ledger-search-criteria-vm'

@Injectable({ providedIn: 'root' })

export class LedgerListResolver {

    constructor(private ledgerService: LedgerService, private sessionStorageService: SessionStorageService) { }

    resolve(): Observable<LedgerListResolved> {
        const storedCriteria: LedgerStoredCriteriaVM = JSON.parse(this.sessionStorageService.getItem('ledger-criteria'))
        const searchCriteria: LedgerSearchCriteriaVM = {
            fromDate: storedCriteria.fromDate,
            toDate: storedCriteria.toDate,
            customers: storedCriteria.customers,
            destinations: storedCriteria.destinations,
            ships: storedCriteria.ships
        }
        return this.ledgerService.get(searchCriteria).pipe(
            map((ledgerList) => new LedgerListResolved(ledgerList)),
            catchError((err: any) => of(new LedgerListResolved(null, err)))
        )
    }

    private buildIds(criteria: any, array: string): number[] {
        const ids = []
        criteria[array].forEach((element: { id: any }) => {
            ids.push(element.id)
        })
        return ids
    }


}
