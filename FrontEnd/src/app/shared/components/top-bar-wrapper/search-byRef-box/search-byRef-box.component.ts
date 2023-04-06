import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
// Custom
import { AccountService } from './../../../services/account.service'
import { MessageLabelService } from '../../../services/message-label.service'

@Component({
    selector: 'search-byRef-box',
    templateUrl: './search-byRef-box.component.html',
    styleUrls: ['./search-byRef-box.component.css'],
})

export class SearchByRefBoxComponent {

    //#region variables

    private feature = 'searchByRefBox'
    public form: FormGroup
    public loginStatus: Observable<boolean>

    //#endregion

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private messageLabelService: MessageLabelService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
    }

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onSearchByRefNo(): void {
        const refNo = this.form.value.searchByRefNo
        this.router.navigate(['reservations/refNo', refNo])
    }

    //#endregion

    //#region private methods

    private initForm(): void {
        this.form = this.formBuilder.group({
            searchByRefNo: ['', [Validators.required]],
        })
    }

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

}
