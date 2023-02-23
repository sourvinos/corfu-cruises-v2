import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { ShipOwnerService } from '../services/shipOwner.service'

@Injectable({ providedIn: 'root' })

export class ShipOwnerListResolver {

    constructor(private shipOwnerService: ShipOwnerService) { }

    resolve(): Observable<ListResolved> {
        return this.shipOwnerService.getAll().pipe(
            map((shipOwnerList) => new ListResolved(shipOwnerList)),
            catchError((err: any) => of(new ListResolved(null, err)))
        )
    }

}
