import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { ReservationHttpService } from '../services/reservation.http.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Injectable({ providedIn: 'root' })

export class ReservationCalendarResolver {

    constructor(private reservationService: ReservationHttpService, private sessionStorageService: SessionStorageService) { }

    resolve(): Observable<ListResolved> {
        return this.reservationService.getForCalendar()
            .pipe(
                map((reservationsCalendar) => new ListResolved(reservationsCalendar)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
