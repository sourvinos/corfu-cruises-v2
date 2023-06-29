import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { EmbarkationListResolved } from './embarkation-list-resolved'
import { EmbarkationSearchCriteria } from '../view-models/criteria/embarkation-search-criteria'
import { EmbarkationService } from '../services/embarkation.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Injectable({ providedIn: 'root' })

export class EmbarkationListResolver {

    constructor(private embarkationService: EmbarkationService, private sessionStorageService: SessionStorageService) { }

    resolve(): Observable<EmbarkationListResolved> {
        const storedCriteria = JSON.parse(this.sessionStorageService.getItem('embarkation-criteria'))
        const searchCriteria: EmbarkationSearchCriteria = {
            date: storedCriteria.date,
            destinationIds: this.buildIds(storedCriteria.destinations),
            portIds: this.buildIds(storedCriteria.ports),
            shipIds: this.buildIds(storedCriteria.ships)
        }
        return this.embarkationService.get(searchCriteria).pipe(
            map((ledgerList) => new EmbarkationListResolved(ledgerList)),
            catchError((err: any) => of(new EmbarkationListResolved(null, err)))
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
