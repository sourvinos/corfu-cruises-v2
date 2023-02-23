import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
// Custom
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { RegistrarService } from '../services/registrar.service'

@Injectable({ providedIn: 'root' })

export class RegistrarFormResolver {

    constructor(private registrarService: RegistrarService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.registrarService.getSingle(route.params.id).pipe(
            map((registrarForm) => new FormResolved(registrarForm)),
            catchError((err: any) => of(new FormResolved(null, err)))
        )
    }

}
