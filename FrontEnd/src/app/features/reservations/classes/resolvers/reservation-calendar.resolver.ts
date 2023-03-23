import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { ReservationHttpService } from '../services/reservation.http.service'

@Injectable({ providedIn: 'root' })

export class ReservationCalendarResolver {

    constructor(private reservationService: ReservationHttpService) { }

    resolve(): Observable<ListResolved> {
        return this.reservationService.getForCalendar()
            .pipe(
                map((reservationsCalendar) => new ListResolved(reservationsCalendar)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
