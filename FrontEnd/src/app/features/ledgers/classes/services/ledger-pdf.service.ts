import { Injectable } from '@angular/core'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { HasTransferGroupVM } from '../view-models/list/ledger-port-group-vm'
import { LedgerCriteriaVM } from '../view-models/criteria/ledger-criteria-vm'
import { LedgerReservationVM } from '../view-models/list/ledger-reservation-vm'
import { LedgerVM } from '../view-models/list/ledger-vm'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'
import { environment } from './../../../../../environments/environment'
// Fonts
import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfMake from 'pdfmake/build/pdfmake'
import { strAkaAcidCanterBold } from 'src/assets/fonts/Aka-Acid-CanterBold.Base64.encoded'
import { strUbuntuCondensed } from 'src/assets/fonts/UbuntuCondensed.Base64.encoded'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class LedgerPDFService {

    private rows: LedgerVM[]

    constructor(private dateHelperService: DateHelperService, private logoService: LogoService) { }

    public doReportTasks(customers: LedgerVM[], criteria: LedgerCriteriaVM): void {
        customers.forEach(customer => {
            this.createPdf(customer, criteria)
        })
    }

    private createPdf(customer: LedgerVM, criteria: LedgerCriteriaVM): void {
        this.rows = []
        this.setFonts()
        this.createReport(customer, criteria)
        const dd = {
            background: this.setBackgroundImage(),
            pageOrientation: 'landscape',
            pageSize: 'A4',
            content: [
                {
                    table: {
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 20, 'auto', '*'],
                        body: this.rows,
                        heights: 5
                    },
                }
            ],
            info: {
                title: 'Customer ledgers'
            },
            styles: {
                AkaAcidCanterBold: {
                    font: 'AkaAcidCanterBold',
                },
                UbuntuCondensed: {
                    font: 'UbuntuCondensed',
                }
            },
            defaultStyle: {
                font: 'UbuntuCondensed',
                fontSize: 8
            },
            footer: (currentPage: { toString: () => string }, pageCount: string): void => {
                return this.createFooter(currentPage, pageCount)
            }
        }
        this.openPdf(dd)
    }

    private setFonts(): void {
        pdfFonts.pdfMake.vfs['AkaAcidCanterBold'] = strAkaAcidCanterBold
        pdfFonts.pdfMake.vfs['UbuntuCondensed'] = strUbuntuCondensed
        pdfMake.fonts = {
            AkaAcidCanterBold: {
                normal: 'AkaAcidCanterBold'
            },
            UbuntuCondensed: {
                normal: 'UbuntuCondensed',
            }
        }
    }

    private setBackgroundImage(): any[] {
        const backgroundImage = [
            {
                image: this.logoService.getLogo(),
                width: 1000,
                opacity: 0.03
            }
        ]
        return backgroundImage
    }

    private openPdf(document: any): void {
        pdfMake.createPdf(document).open()
    }

    private calculateBodyTotals(personIdentifier: string, record: any[]): number {
        let sum = 0
        record.forEach(element => {
            sum += element[personIdentifier]
        })
        return sum
    }

    private createFooter(currentPage: { toString: any }, pageCount: string): any {
        const footer = {
            layout: 'noBorders',
            margin: [0, 10, 40, 10],
            table: {
                widths: ['100%'],
                body: [
                    [
                        { text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', fontSize: 6 }
                    ]
                ]
            }
        }
        return footer
    }

    private createReport(customer: LedgerVM, criteria: LedgerCriteriaVM): any {
        this.rows.push(this.addReportHeader())
        this.rows.push(this.addCustomerHeader(criteria, customer))
        this.rows.push(this.addReservationsHeader())
        customer.reservations.forEach((reservation: LedgerReservationVM) => {
            this.rows.push(this.addReservationDetails(reservation))
        })
        this.rows.push(this.addReservationsTotals(customer))
        this.rows.push(this.addBlankLine())
        customer.ports.forEach((port: any) => {
            this.rows.push(this.addPortHeader(port))
            this.rows.push(this.addPortDetailsHeader())
            port.hasTransferGroup.forEach((hasTransfer: HasTransferGroupVM) => {
                this.rows.push(this.addPortPerTransferTotals(hasTransfer))
            })
        })
        this.rows.push(this.addBlankLine())
    }

    private addReportHeader(): any {
        const row = ([
            { text: environment.appName, color: '#0a5f91', fontSize: 20, style: 'AkaAcidCanterBold', colSpan: 14, border: [false, false, false, false] },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
        ])
        return row
    }

    private addCustomerHeader(criteria: LedgerCriteriaVM, customer: LedgerVM): any {
        const row = ([
            { text: customer.customer.description, colSpan: 12, margin: [0, 0, 0, 10], border: [false, false, false, false] },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: this.dateHelperService.formatISODateToLocale(criteria.fromDate) + ' ' + this.dateHelperService.formatISODateToLocale(criteria.toDate), alignment: 'right', colSpan: 2, border: [false, false, false, false] },
            { text: '' },
        ])
        return row
    }

    private addReservationsHeader(): any {
        const row = ([
            { text: 'Date', alignment: 'center' },
            { text: 'Destination', alignment: 'center' },
            { text: 'Port', alignment: 'center' },
            { text: 'Ship', alignment: 'center' },
            { text: 'RefNo', alignment: 'center' },
            { text: 'TicketNo', alignment: 'center' },
            { text: 'Adults', alignment: 'center', fillColor: '#deecf5' },
            { text: 'Kids', alignment: 'center', fillColor: '#deecf5' },
            { text: 'Free', alignment: 'center', fillColor: '#deecf5' },
            { text: 'Total', alignment: 'center', fillColor: '#deecf5' },
            { text: 'Actual', alignment: 'center', fillColor: '#deecf5' },
            { text: 'N/S', alignment: 'center', fillColor: '#deecf5' },
            { text: 'Transfer', fillColor: '#deecf5' },
            { text: 'Remarks' }
        ])
        return row
    }

    private addReservationDetails(reservation: LedgerReservationVM): any {
        const row = ([
            { text: this.dateHelperService.formatISODateToLocale(reservation.date) },
            { text: reservation.destination.abbreviation },
            { text: reservation.port.abbreviation },
            { text: reservation.ship.description },
            { text: reservation.refNo },
            { text: reservation.ticketNo },
            { text: this.formatZeroAsEmpty(reservation.adults), alignment: 'right' },
            { text: this.formatZeroAsEmpty(reservation.kids), alignment: 'right' },
            { text: this.formatZeroAsEmpty(reservation.free), alignment: 'right' },
            { text: this.formatZeroAsEmpty(reservation.totalPax), alignment: 'right' },
            { text: this.formatZeroAsEmpty(reservation.embarkedPassengers), alignment: 'right' },
            { text: this.formatZeroAsEmpty(reservation.totalNoShow), alignment: 'right' },
            { text: reservation.hasTransfer ? 'Yes' : 'No', alignment: 'center' },
            { text: reservation.remarks }
        ])
        return row
    }

    private addReservationsTotals(customer: LedgerVM): any {
        const row = [
            { text: '', colSpan: 6, border: [false, false, false, false] },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: this.formatZeroAsEmpty(this.calculateBodyTotals('adults', customer.reservations)), alignment: 'right', fillColor: '#deecf5' },
            { text: this.formatZeroAsEmpty(this.calculateBodyTotals('kids', customer.reservations)), alignment: 'right', fillColor: '#deecf5' },
            { text: this.formatZeroAsEmpty(this.calculateBodyTotals('free', customer.reservations)), alignment: 'right', fillColor: '#deecf5' },
            { text: this.formatZeroAsEmpty(this.calculateBodyTotals('totalPax', customer.reservations)), alignment: 'right', fillColor: '#deecf5' },
            { text: this.formatZeroAsEmpty(this.calculateBodyTotals('embarkedPassengers', customer.reservations)), alignment: 'right', fillColor: '#deecf5' },
            { text: this.formatZeroAsEmpty(this.calculateBodyTotals('totalNoShow', customer.reservations)), alignment: 'right', fillColor: '#deecf5' },
            { text: '', fillColor: '#deecf5' },
            { text: '', border: [false, false, false, false] }
        ]
        return row
    }

    private addBlankLine(): any {
        const row = [
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] }
        ]
        return row
    }

    private addPortHeader(port: { port: any }): any {
        const row = [
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: port.port.description, colSpan: 7, border: [true, true, true, true], fillColor: '#deecf5' },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] }
        ]
        return row
    }

    private addPortDetailsHeader(): any {
        const row = [
            { text: '', colSpan: 6, border: [false, false, false, false] },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: 'Adults' },
            { text: 'Kids' },
            { text: 'Free' },
            { text: 'Total' },
            { text: 'Actual' },
            { text: 'N/S', alignment: 'center' },
            { text: 'Transfer' },
            { text: '', border: [false, false, false, false] }
        ]
        return row
    }

    private addPortPerTransferTotals(hasTransfer: HasTransferGroupVM): any {
        const row = [
            { text: '', colSpan: 6, border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: '', border: [false, false, false, false] },
            { text: this.formatZeroAsEmpty(hasTransfer.adults), alignment: 'right', border: [true, true, true, true] },
            { text: this.formatZeroAsEmpty(hasTransfer.kids), alignment: 'right', border: [true, true, true, true] },
            { text: this.formatZeroAsEmpty(hasTransfer.free), alignment: 'right', border: [true, true, true, true] },
            { text: this.formatZeroAsEmpty(hasTransfer.totalPax), alignment: 'right', border: [true, true, true, true] },
            { text: this.formatZeroAsEmpty(hasTransfer.totalPassengers), alignment: 'right', border: [true, true, true, true] },
            { text: this.formatZeroAsEmpty(hasTransfer.totalPax - hasTransfer.totalPassengers), alignment: 'right', border: [true, true, true, true] },
            { text: hasTransfer.hasTransfer ? 'Yes' : 'No', alignment: 'center', border: [true, true, true, true] },
            { text: '', border: [false, false, false, false] },
        ]
        return row
    }

    private formatZeroAsEmpty(number: number): any {
        return number == 0 ? '' : number
    }

}
