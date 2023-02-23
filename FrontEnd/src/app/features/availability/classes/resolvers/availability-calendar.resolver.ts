import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { DateHelperService } from './../../../../shared/services/date-helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { AvailabilityService } from '../services/availability.service'

@Injectable({ providedIn: 'root' })

export class AvailabilityCalendarResolver {

    constructor(private availabilityService: AvailabilityService, private localStorageService: LocalStorageService, private dateHelperService: DateHelperService) { }

    resolve(): Observable<ListResolved> {
        let year = parseInt(this.localStorageService.getItem('activeYearAvailability'))
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
