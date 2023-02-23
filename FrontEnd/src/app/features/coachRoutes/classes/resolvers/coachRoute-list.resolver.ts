import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { CoachRouteService } from '../services/coachRoute.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'

@Injectable({ providedIn: 'root' })

export class CoachRouteListResolver {

    constructor(private coachRouteService: CoachRouteService) { }

    resolve(): Observable<ListResolved> {
        return this.coachRouteService.getAll().pipe(
            map((coachRouteList) => new ListResolved(coachRouteList)),
            catchError((err: any) => of(new ListResolved(null, err)))
        )
    }

}
