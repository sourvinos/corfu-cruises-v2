import { Component } from '@angular/core'

@Component({
    selector: 'top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent {

    public isLoginOrForgotPasswordVisible: boolean

    public onClickMenu(): void {
        document.getElementById('hamburger-menu').classList.toggle('visible')
        document.getElementById('secondary-menu').classList.toggle('visible')
    }

    ngDoCheck(): void {
        if (this.isFormVisible('login-form') || this.isFormVisible('forgot-password-form')) {
            this.isLoginOrForgotPasswordVisible = true
        } else {
            this.isLoginOrForgotPasswordVisible = false
        }
    }

    private isFormVisible(formName: string): boolean {
        const element = document.getElementById(formName)
        if (typeof (element) != 'undefined' && element != null) {
            return true
        } else {
            return false
        }
    }

}
