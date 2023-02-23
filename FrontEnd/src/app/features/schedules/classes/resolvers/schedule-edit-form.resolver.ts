import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { ScheduleService } from '../services/schedule.service'
import { catchError, map, of } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class ScheduleEditFormResolver {

    constructor(private scheduleService: ScheduleService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.scheduleService.getSingle(route.params.id).pipe(
            map((scheduleEditForm) => new FormResolved(scheduleEditForm)),
            catchError((err: any) => of(new FormResolved(null, err)))
        )
    }

}
