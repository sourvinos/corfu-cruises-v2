import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { ManifestListResolved } from './manifest-list-resolved'
import { ManifestService } from '../services/manifest.service'

@Injectable({ providedIn: 'root' })

export class ManifestListResolver {

    constructor(private localStorageService: LocalStorageService, private manifestService: ManifestService) { }

    resolve(): Observable<ManifestListResolved> {
        const criteria = JSON.parse(this.localStorageService.getItem('manifest-criteria'))
        const date = criteria.date
        const destinationId = criteria.destinations[0].id
        const portIds = this.buildPorts(criteria)
        const shipId = criteria.ships[0].id
        return this.manifestService.get(date, destinationId, shipId, portIds).pipe(
            map((manifestList) => new ManifestListResolved(manifestList)),
            catchError((err: any) => of(new ManifestListResolved(null, err)))
        )
    }

    private buildPorts(criteria): number[] {
        const portIds = []
        criteria.ports.forEach((port: { id: any }) => {
            portIds.push(port.id)
        })
        return portIds
    }

}
