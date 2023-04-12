import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { LedgerCriteriaVM } from '../view-models/criteria/ledger-criteria-vm'
import { LedgerListResolved } from './ledger-list-resolved'
import { LedgerService } from '../services/ledger.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Injectable({ providedIn: 'root' })

export class LedgerListResolver {

    constructor(private ledgerService: LedgerService, private sessionStorageService: SessionStorageService) { }

    resolve(): Observable<LedgerListResolved> {
        const criteria: LedgerCriteriaVM = JSON.parse(this.sessionStorageService.getItem('ledger-criteria'))
        return this.ledgerService.get(
            criteria.fromDate,
            criteria.toDate,
            this.buildIds(criteria, 'destinations'),
            this.buildIds(criteria, 'ships')
        ).pipe(
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
