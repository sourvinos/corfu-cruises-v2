import { MessageSnackbarService } from './../../../../shared/services/messages-snackbar.service'
import { Component } from '@angular/core'
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { AccountService } from 'src/app/shared/services/account.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ConfirmValidParentMatcher, ValidationService } from 'src/app/shared/services/validation.service'
import { ResetPasswordViewModel } from '../../classes/view-models/reset-password-view-model'
import { HelperService } from 'src/app/shared/services/helper.service'
import { DialogService } from 'src/app/shared/services/dialog.service'

@Component({
    selector: 'reset-password-form',
    templateUrl: './reset-password-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', '../../../../shared/styles/login-forgot-reset-password.css', '../../../../shared/styles/login-forgot-reset-password-logo.css']
})


export class ResetPasswordFormComponent {

    public hidePassword = true
    private email: string
    private token: string
    public form: FormGroup
    public feature = 'resetPasswordForm'
    public featureIcon = 'password'
    public icon = null
    public input: InputTabStopDirective
    public parentUrl = null
    public confirmValidParentMatcher = new ConfirmValidParentMatcher()

    constructor(
        private router: Router,
        private helperService: HelperService,
        private dialogService: DialogService,
        private accountService: AccountService,
        private activatedRoute: ActivatedRoute,
        private messageSnackbarService: MessageSnackbarService,
        private formBuilder: FormBuilder,
        private messageLabelService: MessageLabelService,
        private messageHintService: MessageHintService
    ) {
        this.activatedRoute.queryParams.subscribe((p) => {
            this.email = p['email']
            this.token = p['token']
        })
    }

    ngOnInit(): void {
        console.log(this.email)
        console.log(this.token)
        this.initForm()
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            email: [this.email],
            token: [this.token],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(128), ValidationService.containsSpace]],
                confirmPassword: ['', [Validators.required]]
            }, { validator: ValidationService.childrenEqual })
        })
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onSave(): void {
        this.saveRecord(this.flattenForm())
    }

    private saveRecord(form: ResetPasswordViewModel): void {
        this.accountService.resetPassword(form).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                this.router.navigate(['/login'])
            },
            error: () => {
                this.dialogService.open(this.messageSnackbarService.unableToResetPassword(), 'error', 'right-buttons', ['ok'])
            }
        })
    }

    private flattenForm(): ResetPasswordViewModel {
        const vm = {
            email: this.email,
            password: this.form.value.passwords.password,
            confirmPassword: this.form.value.passwords.confirmPassword,
            token: this.token
        }
        return vm
    }

    //#region getters

    get passwords(): AbstractControl {
        return this.form.get('passwords')
    }

    get password(): AbstractControl {
        return this.form.get('passwords.password')
    }

    get confirmPassword(): AbstractControl {
        return this.form.get('passwords.confirmPassword')
    }

    get matchingPasswords(): boolean {
        return this.form.get('passwords.password').value === this.form.get('passwords.confirmPassword').value
    }

    //#endregion

}
