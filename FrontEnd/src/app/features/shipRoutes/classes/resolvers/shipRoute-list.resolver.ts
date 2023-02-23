import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { ShipRouteService } from '../services/shipRoute.service'

@Injectable({ providedIn: 'root' })

export class ShipRouteListResolver {

    constructor(private shipRouteService: ShipRouteService) { }

    resolve(): Observable<ListResolved> {
        return this.shipRouteService.getAll().pipe(
            map((shipRouteList) => new ListResolved(shipRouteList)),
            catchError((err: any) => of(new ListResolved(null, err)))
        )
    }

}
