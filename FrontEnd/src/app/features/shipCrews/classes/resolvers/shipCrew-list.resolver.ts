import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { ShipCrewService } from '../services/shipCrew.service'

@Injectable({ providedIn: 'root' })

export class ShipCrewListResolver {

    constructor(private shipCrewService: ShipCrewService) { }

    resolve(): Observable<ListResolved> {
        return this.shipCrewService.getAll().pipe(
            map((shipCrewList) => new ListResolved(shipCrewList)),
            catchError((err: any) => of(new ListResolved(null, err)))
        )
    }

}
