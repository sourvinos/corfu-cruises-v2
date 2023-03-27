import { Component, HostListener } from '@angular/core'
import { Router } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { ConnectedUser } from 'src/app/shared/classes/connected-user'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { Menu } from 'src/app/shared/classes/menu'
import { MessageMenuService } from '../../../services/message-menu.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['../../../../../assets/styles/dropdown-menu.css']
})

export class UserMenuComponent {

    //#region variables

    private ngunsubscribe = new Subject<void>()
    private userId: string
    public displayedUsername: string
    public imgIsLoaded = false
    public menuItems: Menu[] = []

    //#endregion

    constructor(private accountService: AccountService, private interactionService: InteractionService, private messageMenuService: MessageMenuService, private router: Router, private sessionStorageService: SessionStorageService) { }

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
            this.subscribeToInteractionService()
            this.getDisplayedUsername()
            this.getUserId()
        })
    }

    //#endregion

    //#region public methods

    public doNavigationTasks(feature: string): void {
        if (feature.substring(5) == 'logout') {
            this.accountService.logout()
        } else {
            this.sessionStorageService.saveItem('returnUrl', '/')
            this.router.navigate(['/users/' + this.userId])
        }
    }

    public editRecord(): void {
        this.sessionStorageService.saveItem('returnUrl', '/')
        this.router.navigate(['/users/' + this.userId])
    }

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageMenuService.getDescription(this.menuItems, id)
    }

    public hideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    public imageIsLoading(): any {
        return this.imgIsLoaded ? '' : 'skeleton'
    }

    public loadImage(): void {
        this.imgIsLoaded = true
    }

    public logout(): void {
        this.accountService.logout()
    }

    //#endregion

    //#region private methods

    private createMenu(items: Menu[]): void {
        this.menuItems = []
        items.forEach(item => {
            if (item.id.startsWith('user')) {
                this.menuItems.push(item)
            }
        })
    }

    private getDisplayedUsername(): void {
        this.displayedUsername = ConnectedUser.displayname
    }

    private getUserId(): void {
        this.userId = ConnectedUser.id
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshMenus.pipe(takeUntil(this.ngunsubscribe)).subscribe(() => {
            this.messageMenuService.getMessages().then((response) => {
                this.menuItems = response
                this.createMenu(response)
            })
        })
    }

    //#endregion

}
