import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'forgot-password-form',
    templateUrl: './forgot-password-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', '../../../../shared/styles/login-forgot-reset-password.css']
})

export class ForgotPasswordFormComponent {

    //#region variables

    private unlisten: Unlisten
    private unsubscribe = new Subject<void>()
    public feature = 'forgotPasswordForm'
    public featureIcon = 'password'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/login'
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private helperService: HelperService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private router: Router, private sessionStorageService: SessionStorageService,) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateFields()
        this.focusOnField('email')
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
        this.unlisten()
    }

    //#endregion

    //#region public methods

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onSave(): void {
        this.accountService.forgotPassword(this.form.value).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.emailSent(), 'success', this.parentUrl, this.form, true, true)
            },
            error: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.emailNotSent(), 'error', this.parentUrl, this.form)
            }
        })
    }

    //#endregion

    //#region private methods

    private focusOnField(field: string): void {
        this.helperService.focusOnField(field)
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            returnUrl: '',
            language: ''
        })
    }

    private populateFields(): void {
        this.form.setValue({
            email: environment.login.email,
            returnUrl: environment.clientUrl,
            language: this.sessionStorageService.getLanguage(),
        })
    }

    //#endregion

    //#region getters

    get email(): AbstractControl {
        return this.form.get('email')
    }

    //#endregion

}
