import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
// Custom
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { GenderService } from '../services/gender.service'

@Injectable({ providedIn: 'root' })

export class GenderFormResolver {

    constructor(private genderService: GenderService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.genderService.getSingle(route.params.id).pipe(
            map((genderForm) => new FormResolved(genderForm)),
            catchError((err: any) => of(new FormResolved(null, err)))
        )
    }

}
