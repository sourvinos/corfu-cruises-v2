import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { AvailabilityService } from '../services/availability.service'
import { DateHelperService } from './../../../../shared/services/date-helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Injectable({ providedIn: 'root' })

export class AvailabilityCalendarResolver {

    constructor(private availabilityService: AvailabilityService, private dateHelperService: DateHelperService, private sessionStorageService: SessionStorageService) { }

    resolve(): Observable<ListResolved> {
        let year = parseInt(this.sessionStorageService.getItem('year'))
        if (isNaN(year)) {
            year = this.dateHelperService.getCurrentYear()
        }
        return this.availabilityService.getForCalendar(year)
            .pipe(
                map((availabilityCalendar) => new ListResolved(availabilityCalendar)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
