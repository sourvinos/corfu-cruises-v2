import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { ReservationService } from '../services/reservation.service'

@Injectable({ providedIn: 'root' })

export class ReservationListResolverByDate {

    constructor(private reservationService: ReservationService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ListResolved> {
        return this.reservationService.getByDate(route.params.date)
            .pipe(
                map((reservationList) => new ListResolved(reservationList)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
