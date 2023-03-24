import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { AvailabilityHttpService } from '../services/availability.http.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'

@Injectable({ providedIn: 'root' })

export class AvailabilityCalendarResolver {

    constructor(private availabilityService: AvailabilityHttpService) { }

    resolve(): Observable<ListResolved> {
        return this.availabilityService.getForCalendar()
            .pipe(
                map((availabilityCalendar) => new ListResolved(availabilityCalendar)),
                catchError((err: any) => of(new ListResolved(null, err)))
            )
    }

}
