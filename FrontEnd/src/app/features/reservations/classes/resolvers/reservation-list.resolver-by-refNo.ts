import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { ReservationHttpService } from '../services/reservation.http.service'

@Injectable({ providedIn: 'root' })

export class ReservationListResolverByRefNo {

    constructor(private reservationService: ReservationHttpService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ListResolved> {
        return this.reservationService.getByRefNo(route.params.refNo)
            .pipe(
                map((resevationList) => new ListResolved(resevationList)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
