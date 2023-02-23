import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
// Custom
import { DriverService } from '../services/driver.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'

@Injectable({ providedIn: 'root' })

export class DriverFormResolver {

    constructor(private driverService: DriverService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.driverService.getSingle(route.params.id).pipe(
            map((driverForm) => new FormResolved(driverForm)),
            catchError((err: any) => of(new FormResolved(null, err)))
        )
    }

}
