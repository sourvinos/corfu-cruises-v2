import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { DateHelperService } from './../../../../shared/services/date-helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { ReservationService } from '../services/reservation.service'

@Injectable({ providedIn: 'root' })

export class ReservationCalendarResolver {

    constructor(private reservationService: ReservationService, private localStorageService: LocalStorageService, private dateHelperService: DateHelperService) { }

    resolve(): Observable<ListResolved> {
        let year = parseInt(this.localStorageService.getItem('year'))
        if (isNaN(year)) {
            year = this.dateHelperService.getCurrentYear()
        }
        return this.reservationService.getForCalendar(year)
            .pipe(
                map((reservationsCalendar) => new ListResolved(reservationsCalendar)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
