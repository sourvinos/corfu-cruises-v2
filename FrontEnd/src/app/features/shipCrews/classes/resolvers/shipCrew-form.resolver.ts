import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
// Custom
import { ShipCrewService } from '../services/shipCrew.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'

@Injectable({ providedIn: 'root' })

export class ShipCrewFormResolver {

    constructor(private shipCrewService: ShipCrewService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.shipCrewService.getSingle(route.params.id).pipe(
            map((shipCrewForm) => new FormResolved(shipCrewForm)),
            catchError((err: any) => of(new FormResolved(null, err)))
        )
    }

}
