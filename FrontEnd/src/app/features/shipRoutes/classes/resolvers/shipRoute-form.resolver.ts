import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
// Custom
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { ShipRouteService } from '../services/shipRoute.service'

@Injectable({ providedIn: 'root' })

export class ShipRouteFormResolver {

    constructor(private shipRouteService: ShipRouteService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.shipRouteService.getSingle(route.params.id).pipe(
            map((shipRouteForm) => new FormResolved(shipRouteForm)),
            catchError((err: any) => of(new FormResolved(null, err)))
        )
    }

}
