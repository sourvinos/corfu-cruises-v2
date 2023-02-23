import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
// Custom
import { CoachRouteService } from '../services/coachRoute.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'

@Injectable({ providedIn: 'root' })

export class RouteFormResolver {

    constructor(private coachRouteService: CoachRouteService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.coachRouteService.getSingle(route.params.id).pipe(
            map((coachRouteForm) => new FormResolved(coachRouteForm)),
            catchError((err: any) => of(new FormResolved(null, err)))
        )
    }

}
