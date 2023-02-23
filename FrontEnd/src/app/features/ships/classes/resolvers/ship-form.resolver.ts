import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
// Custom
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { ShipService } from '../services/ship.service'

@Injectable({ providedIn: 'root' })

export class ShipFormResolver {

    constructor(private shipService: ShipService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.shipService.getSingle(route.params.id).pipe(
            map((customerForm) => new FormResolved(customerForm)),
            catchError((err: any) => of(new FormResolved(null, err)))
        )
    }

}
