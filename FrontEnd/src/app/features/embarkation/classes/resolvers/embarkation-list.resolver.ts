import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { EmbarkationCriteriaVM } from '../view-models/criteria/embarkation-criteria-vm'
import { EmbarkationListResolved } from './embarkation-list-resolved'
import { EmbarkationService } from '../services/embarkation.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Injectable({ providedIn: 'root' })

export class EmbarkationListResolver {

    constructor(private embarkationService: EmbarkationService, private sessionStorageService: SessionStorageService) { }

    resolve(): Observable<EmbarkationListResolved> {
        const criteria: EmbarkationCriteriaVM = JSON.parse(this.sessionStorageService.getItem('embarkation-criteria'))
        return this.embarkationService.get(
            criteria.date,
            this.buildIds(criteria, 'destinations'),
            this.buildIds(criteria, 'ports'),
            this.buildIds(criteria, 'ships')).pipe(
                map((embarkationList) => new EmbarkationListResolved(embarkationList)),
                catchError((err: any) => of(new EmbarkationListResolved(null, err)))
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
