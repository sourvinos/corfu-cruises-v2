import { Component, HostListener } from '@angular/core'
import { Observable, Subject, takeUntil } from 'rxjs'
import { Router } from '@angular/router'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ConnectedUser } from 'src/app/shared/classes/connected-user'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { Menu } from 'src/app/shared/classes/menu'
import { MessageMenuService } from 'src/app/shared/services/messages-menu.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'reservations-menu',
    templateUrl: './reservations-menu.component.html',
    styleUrls: ['../../../../../assets/styles/dropdown-menu.css']
})

export class ReservationsMenuComponent {

    //#region variables

    private ngunsubscribe = new Subject<void>()
    public imgIsLoaded = false
    public loginStatus: Observable<boolean>
    public menuItems: Menu[] = []

    //#endregion

    constructor(private accountService: AccountService, private interactionService: InteractionService, private messageMenuService: MessageMenuService, private router: Router) { }

    //#region listeners

    @HostListener('mouseenter') onMouseEnter(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.remove('hidden')
        })
    }

    //#endregion

    //#region lifecycle hooks

    ngOnInit(): void {
        this.messageMenuService.getMessages().then((response) => {
            this.createMenu(response)
            this.removeMenuItemIfAdmin()
            this.subscribeToInteractionService()
        })
    }

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public doNavigationTasks(feature: string): void {
        this.router.navigate([feature.substring(13)])
    }

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename + '.svg'
    }

    public hideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    public imageIsLoading(): any {
        return this.imgIsLoaded ? '' : 'skeleton'
    }

    public isAdmin(): boolean {
        return ConnectedUser.isAdmin
    }

    public loadImage(): void {
        this.imgIsLoaded = true
    }

    //#endregion

    //#region private methods

    private createMenu(items: Menu[]): void {
        this.menuItems = []
        items.forEach(item => {
            if (item.id.startsWith('reservations')) {
                this.menuItems.push(item)
            }
        })
    }

    private removeMenuItemIfAdmin(): void {
        if (this.isAdmin()) {
            this.menuItems.splice(2)
        }
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshMenus.pipe(takeUntil(this.ngunsubscribe)).subscribe(() => {
            this.messageMenuService.getMessages().then((response) => {
                this.menuItems = response
                this.createMenu(response)
                this.removeMenuItemIfAdmin()
            })
        })
    }

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion

}
