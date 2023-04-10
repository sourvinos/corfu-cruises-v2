import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'intro-form',
    templateUrl: './intro-form.component.html',
    styleUrls: ['../../../shared/styles/login-forgot-reset-password.css', './intro-form.component.css']
})

export class IntroFormComponent {

    //#region variables

    public feature = 'introForm'

    //#endregion

    constructor(private router: Router) { }

    //#region public methods
    public onLogin(): void {
        this.router.navigate(['/login'])
    }

    //#endregion

}