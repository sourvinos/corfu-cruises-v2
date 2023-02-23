import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
// Custom
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { PortService } from '../services/port.service'

@Injectable({ providedIn: 'root' })

export class PortFormResolver {

    constructor(private portService: PortService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.portService.getSingle(route.params.id).pipe(
            map((portForm) => new FormResolved(portForm)),
            catchError((err: any) => of(new FormResolved(null, err)))
        )
    }

}
