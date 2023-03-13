import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Component } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ChangePasswordViewModel } from '../../classes/view-models/change-password-view-model'
import { ConfirmValidParentMatcher, ValidationService } from 'src/app/shared/services/validation.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'

@Component({
    selector: 'change-password-form',
    templateUrl: './change-password-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './change-password-form.component.css']
})

export class ChangePasswordFormComponent {

    //#region variables

    private subscription = new Subscription()
    public feature = 'changePasswordForm'
    public featureIcon = 'password'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isLoading = new Subject<boolean>()
    public parentUrl = '/users'

    public confirmValidParentMatcher = new ConfirmValidParentMatcher()
    public hidePassword = true
    private userId: string

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private helperService: HelperService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.doPostInitTasks()
    }

    ngAfterViewInit(): void {
        this.focusOnField()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    canDeactivate(): boolean {
        return this.helperService.goBackFromForm(this.form)
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
        this.saveRecord(this.flattenForm())
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.subscription.unsubscribe()
    }

    private doPostInitTasks(): void {
        this.activatedRoute.params.subscribe(x => {
            this.form.patchValue({
                'userId': x.id
            })
            this.parentUrl = this.parentUrl + '/' + x.id
        })
    }

    private flattenForm(): ChangePasswordViewModel {
        return {
            userId: this.form.value.userId,
            currentPassword: this.form.value.currentPassword,
            password: this.form.value.passwords.password,
            confirmPassword: this.form.value.passwords.confirmPassword
        }
    }

    private focusOnField(): void {
        this.helperService.focusOnField()
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            userId: this.userId,
            currentPassword: ['', [Validators.required]],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(128), ValidationService.containsSpace]],
                confirmPassword: ['', [Validators.required]]
            }, { validator: ValidationService.childrenEqual })
        })

    }

    private saveRecord(vm: ChangePasswordViewModel): void {
        this.accountService.changePassword(vm).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', '', this.form, false).then(() => {
                    this.accountService.logout()
                })
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false, false)
            }
        })
    }

    //#endregion

    //#region getters

    get currentPassword(): AbstractControl {
        return this.form.get('currentPassword')
    }

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
