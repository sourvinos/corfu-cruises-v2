import { Injectable } from '@angular/core'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmbarkationReservationVM } from '../view-models/list/embarkation-reservation-vm'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
// Fonts
import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfMake from 'pdfmake/build/pdfmake'
import { strAkaAcidCanterBold } from '../../../../../assets/fonts/Aka-Acid-CanterBold.Base64.encoded'
import { strPFHandbookPro } from '../../../../../assets/fonts/PF-Handbook-Pro.Base64.encoded'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class EmbarkationPDFService {

    constructor(private dateHelperService: DateHelperService, private logoService: LogoService, private sessionStorageService: SessionStorageService) { }

    //#region public methods

    public createPDF(records: EmbarkationReservationVM[]): void {
        this.setFonts()
        const dd = {
            background: this.setBackgroundImage(),
            info: this.setPageInfo(),
            pageOrientation: 'portrait',
            pageSize: 'A4',
            content: [
                {
                    columns: [
                        this.setTitle(this.populateCriteriaFromStoredVariables()),
                    ]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', 25],
                        body: this.createLines(records),
                    }, layout: 'lightHorizontalLines'
                },
            ],
            styles: {
                AkaAcidCanterBold: {
                    font: 'AkaAcidCanterBold',
                },
                PFHandbookPro: {
                    font: 'PFHandbookPro',
                },
                paddingLeft: {
                    margin: [40, 0, 0, 0]
                },
                paddingTop: {
                    margin: [0, 15, 0, 0]
                }
            },
            defaultStyle: {
                font: 'PFHandbookPro',
                fontSize: 7
            },
            footer: (currentPage: { toString: () => string }, pageCount: string): void => {
                return this.createPageFooter(currentPage, pageCount)
            }
        }
        this.createPdf(dd)
    }

    //#endregion

    //#region private methods

    private createPdf(document: any): void {
        pdfMake.createPdf(document).open()
    }

    private populateCriteriaFromStoredVariables(): any {
        if (this.sessionStorageService.getItem('embarkation-criteria')) {
            const criteria = JSON.parse(this.sessionStorageService.getItem('embarkation-criteria'))
            return {
                'date': criteria.date
            }
        }
    }

    private createLines(records: EmbarkationReservationVM[]): any[] {
        const rows = []
        rows.push([
            { text: 'RefNo', fontSize: 6, margin: [0, 0, 0, 0] },
            { text: 'TicketNo', fontSize: 6 },
            { text: 'Customer', fontSize: 6 },
            { text: 'Destination', fontSize: 6 },
            { text: 'Pickup point', fontSize: 6 },
            { text: 'Driver', fontSize: 6 },
            { text: 'Port', fontSize: 6 },
            { text: 'Ship', fontSize: 6 },
            { text: 'Remarks', fontSize: 6 },
            { text: 'Persons', fontSize: 6, alignment: 'right' }
        ])
        for (const reservation of records) {
            rows.push([
                { text: reservation.refNo, fontSize: 5, margin: [0, 0, 0, 0] },
                { text: reservation.ticketNo, fontSize: 5 },
                { text: reservation.customer.description, fontSize: 5 },
                { text: reservation.destination.abbreviation, fontSize: 5 },
                { text: reservation.pickupPoint.description, fontSize: 5 },
                { text: reservation.driver.description, fontSize: 5 },
                { text: reservation.port.abbreviation, fontSize: 5 },
                { text: reservation.ship.description, fontSize: 5 },
                { text: reservation.remarks, fontSize: 5 },
                { text: reservation.totalPax, alignment: 'right', fontSize: 5 }
            ])
            if (reservation.passengers.length > 0) {
                let index = 0
                for (const passenger of reservation.passengers) {
                    rows.push([
                        { text: '' },
                        { text: '' },
                        { text: this.formatPassengerCount(++index) + passenger.lastname, colSpan: 2, alignment: 'left', fontSize: 5, margin: [10, 0, 0, 0] },
                        { text: '' },
                        { text: passenger.firstname, colSpan: 3, alignment: 'left', fontSize: 5 },
                        { text: '' },
                        { text: '' },
                        { text: '' },
                        { text: '' },
                        { text: '' }
                    ])
                }
            } else {
                rows.push([
                    { text: '' },
                    { text: '' },
                    { text: 'We didn\'t find any passengers!', colSpan: 2, alignment: 'left', fontSize: 5, margin: [10, 0, 0, 0] },
                    { text: '' },
                    { text: '' },
                    { text: '' },
                    { text: '' },
                    { text: '' },
                    { text: '' },
                    { text: '' }
                ])
            }
        }
        return rows
    }

    private setFonts(): void {
        pdfFonts.pdfMake.vfs['AkaAcidCanterBold'] = strAkaAcidCanterBold
        pdfFonts.pdfMake.vfs['PFHandbookPro'] = strPFHandbookPro
        pdfMake.fonts = {
            PFHandbookPro: {
                normal: 'PFHandbookPro',
            },
            AkaAcidCanterBold: {
                normal: 'AkaAcidCanterBold'
            }
        }
    }

    private setBackgroundImage(): any[] {
        const backgroundImage = [
            {
                image: this.logoService.getLogo(),
                width: '1000',
                opacity: 0.03
            }
        ]
        return backgroundImage
    }

    private setPageInfo(): any {
        const pageInfo = {
            title: 'Embarkation',
            filename: 'Boos.pdf'
        }
        return pageInfo
    }

    private setTitle(criteriaFromStorage: any): any {
        const title = {
            type: 'none',
            margin: [0, 0, 0, 0],
            ul: [
                { text: 'CORFU CRUISES' },
                { text: 'ΚΑΤΑΣΤΑΣΗ ΕΠΙΒΙΒΑΣΗΣ', fontSize: 13, style: 'AkaAcidCanterBold' },
                { text: this.dateHelperService.formatISODateToLocale(criteriaFromStorage.date, true) },
                { text: ' ' },
                { text: ' ' }

            ]
        }
        return title
    }

    private createPageFooter(currentPage: { toString: any }, pageCount: string): any {
        const footer = {
            layout: 'noBorders',
            margin: [0, 10, 40, 10],
            table: {
                widths: ['100%'],
                body: [
                    [
                        { text: 'ΣΕΛΙΔΑ ' + currentPage.toString() + ' ΑΠΟ ' + pageCount, alignment: 'right', fontSize: 6 }
                    ]
                ]
            }
        }
        return footer
    }

    private formatPassengerCount(index: number): string {
        const paddedValue = '0' + index
        return paddedValue.substring(paddedValue.length - 2) + '. '
    }

    //#endregion

}