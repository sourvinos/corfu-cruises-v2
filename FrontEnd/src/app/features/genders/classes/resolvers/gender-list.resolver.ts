import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { GenderService } from '../services/gender.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'

@Injectable({ providedIn: 'root' })

export class GenderListResolver {

    constructor(private genderService: GenderService) { }

    resolve(): Observable<ListResolved> {
        return this.genderService.getAll().pipe(
            map((genderList) => new ListResolved(genderList)),
            catchError((err: any) => of(new ListResolved(null, err)))
        )
    }

}
