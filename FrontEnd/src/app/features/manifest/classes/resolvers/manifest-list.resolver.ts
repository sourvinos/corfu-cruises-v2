import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ManifestListResolved } from './manifest-list-resolved'
import { ManifestService } from '../services/manifest.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { ManifestSearchCriteriaVM } from '../view-models/criteria/manifest-criteria-vm'

@Injectable({ providedIn: 'root' })

export class ManifestListResolver {

    constructor(private manifestService: ManifestService, private sessionStorageService: SessionStorageService) { }

    resolve(): Observable<ManifestListResolved> {
        const criteria = JSON.parse(this.sessionStorageService.getItem('manifest-criteria'))
        const searchCriteria: ManifestSearchCriteriaVM = {
            date: criteria.date,
            destinationId: criteria.destinations[0].id,
            portIds: this.buildIds(criteria.ports),
            shipId: criteria.ships[0].id
        }
        return this.manifestService.get(searchCriteria).pipe(
            map((manifestList) => new ManifestListResolved(manifestList)),
            catchError((err: any) => of(new ManifestListResolved(null, err)))
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
