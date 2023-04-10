import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { map, take } from 'rxjs/operators'
// Custom
import { AccountService } from './account.service'

@Injectable({ providedIn: 'root' })

export class AuthGuardService {

    constructor(private accountService: AccountService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.accountService.isLoggedIn.pipe(take(1), map((loginStatus: boolean) => {
            if (!loginStatus) {
                this.router.navigate(['/'])
                return false
            }
            return true
        }))
    }

}