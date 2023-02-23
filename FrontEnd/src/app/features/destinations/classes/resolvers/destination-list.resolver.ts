import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { DestinationService } from '../services/destination.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'

@Injectable({ providedIn: 'root' })

export class DestinationListResolver {

    constructor(private destinationService: DestinationService) { }

    resolve(): Observable<ListResolved> {
        return this.destinationService.getAll().pipe(
            map((customerList) => new ListResolved(customerList)),
            catchError((err: any) => of(new ListResolved(null, err)))
        )
    }

}
