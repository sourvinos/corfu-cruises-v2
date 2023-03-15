import { Component } from '@angular/core'

@Component({
    selector: 'top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent {

    public isLoginForgotResetVisible: boolean

    public onClickMenu(): void {
        document.getElementById('hamburger-menu').classList.toggle('visible')
        document.getElementById('secondary-menu').classList.toggle('visible')
    }

    ngDoCheck(): void {
        if (this.isFormVisible('login-forgot-reset')) {
            this.isLoginForgotResetVisible = true
        } else {
            this.isLoginForgotResetVisible = false
        }
    }

    private isFormVisible(formName: string): boolean {
        const element = document.getElementsByClassName(formName)[0]
        if (typeof (element) != 'undefined' && element != null) {
            return true
        } else {
            return false
        }
    }

}
