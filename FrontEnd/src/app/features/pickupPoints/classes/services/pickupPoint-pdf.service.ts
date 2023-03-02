import { Injectable } from '@angular/core'
// Custom
import { BooleanIconService } from 'src/app/shared/services/boolean-icon.service'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'
import { PickupPointListVM } from '../view-models/pickupPoint-list-vm'
// Fonts
import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfMake from 'pdfmake/build/pdfmake'
import { strAkaAcidCanterBold } from '../../../../../assets/fonts/Aka-Acid-CanterBold.Base64.encoded'
import { strPFHandbookPro } from '../../../../../assets/fonts/PF-Handbook-Pro.Base64.encoded'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class PickupPointPdfService {

    private pdfVM: any[]

    constructor(private booleanIconService: BooleanIconService, private dateHelperService: DateHelperService, private helperService: HelperService, private logoService: LogoService) { }

    //#region public methods

    public createReport(pickupPoints: any[]): void {
        this.pdfVM = this.flattedCoachRoutes(pickupPoints)
        this.setFonts()
        const dd = {
            background: this.setBackgroundImage(),
            info: this.pageMetadata(),
            pageOrientation: 'portrait',
            pageSize: 'A4',
            content:
                [
                    {
                        table: {
                            body: [
                                [this.createOurCompany(), this.createTitle()],
                            ],
                            style: 'table',
                            widths: ['50%', '50%'],
                        },
                        layout: 'noBorders'
                    },
                    [
                        this.createTable(this.pdfVM,
                            ['boolean', '', '', '', ''],
                            ['isActive', 'coachRouteAbbreviation', 'description', 'exactPoint', 'time'],
                            ['center', 'center', 'left', 'left', 'center'])
                    ],
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

    private createOurCompany(): any {
        return {
            type: 'none',
            margin: [0, 0, 0, 0],
            ul: [
                { text: 'ΚΕΡΚΥΡΑΙΚΕΣ ΚΡΟΥΑΖΙΕΡΕΣ', fontSize: 14, style: 'AkaAcidCanterBold' },
                { text: 'ΝΑΥΤΙΚΗ ΕΤΑΙΡΕΙΑ' },
                { text: 'ΚΑΒΟΣ' },
                { text: 'ΛΕΥΚΙΜΜΗ ΚΕΡΚΥΡΑΣ' },
                { text: '2662061400' },
                { text: 'corfucruises.com@gmail.com' }
            ]
        }
    }

    private createTitle(): any {
        return {
            type: 'none',
            margin: [0, 0, 0, 0],
            ul: [
                { text: 'ΣΗΜΕΙΑ ΠΑΡΑΛΑΒΗΣ', fontSize: 13, style: 'AkaAcidCanterBold' }
            ]
        }
    }

    private createTableHeaders(): any[] {
        return [
            { text: 'ΕΝΕΡΓΟ', style: 'tableHeader', alignment: 'center', bold: false },
            { text: 'ΔΙΑΔΡΟΜΗ', style: 'tableHeader', alignment: 'center', bold: false },
            { text: 'ΠΕΡΙΓΡΑΦΗ', style: 'tableHeader', alignment: 'center', bold: false },
            { text: 'ΑΚΡΙΒΕΣ ΣΗΜΕΙΟ', style: 'tableHeader', alignment: 'center', bold: false },
            { text: 'ΩΡΑ', style: 'tableHeader', alignment: 'center', bold: false },
        ]
    }

    private createPageFooter(currentPage: { toString: any }, pageCount: string): any {
        return {
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
    }

    private flattedCoachRoutes(pickupPoints: any[]): any {
        pickupPoints.forEach(pickupPoint => {
            const coachRoute = this.helperService.flattenObject(pickupPoint.coachRoute)
            pickupPoint.coachRouteAbbreviation = coachRoute.abbreviation
        })
        return pickupPoints
    }

    private pageMetadata(): any {
        const pageInfo = {
            title: 'Pickup Points'
        }
        return pageInfo
    }

    private createPdf(document: any): void {
        pdfMake.createPdf(document).open()
    }

    private createTable(data: any[], columnTypes: any[], columns: any[], align: any[]): any {
        return {
            table: {
                headerRows: 1,
                dontBreakRows: true,
                body: this.createTableRows(data, columnTypes, columns, align),
                bold: false,
                style: 'table',
                layout: 'noBorders',
                widths: ['10%', '20%', '40%', '20%', '10%'],
                margin: [0, 10, 0, 0],
            },
            layout: 'lightHorizontalLines',
            margin: [0, 10, 0, 0]
        }
    }

    private createTableRows(data: any[], columnTypes: any[], columns: any[], align: any[]): void {
        const body: any = []
        body.push(this.createTableHeaders())
        data.forEach((row) => {
            let dataRow = []
            dataRow = this.processRow(columnTypes, columns, row, dataRow, align)
            body.push(dataRow)
        })
        return body
    }

    private processRow(columnTypes: any[], columns: any[], row: PickupPointListVM, dataRow: any[], align: any[]): any {
        columns.forEach((column, index) => {
            if (columnTypes[index] == 'boolean') {
                dataRow.push(row[column] == true
                    ? { image: this.booleanIconService.getTrueIcon(), fit: [8, 8], alignment: 'center' }
                    : { image: this.booleanIconService.getFalseIcon(), fit: [8, 8], alignment: 'center' })
            }
            if (columnTypes[index] == '') {
                dataRow.push({ text: this.formatField(columnTypes[index], row[column]), alignment: align[index].toString(), color: '#000000', noWrap: false, margin: [0, 1, 0, 0] })
            }
        })
        return dataRow
    }

    private formatField(type: any, field: string | number | Date): string {
        switch (type) {
            case 'date':
                return this.dateHelperService.formatISODateToLocale(field.toString(), false, true)
            default:
                return field != undefined ? field.toString() : ''
        }
    }

    private setBackgroundImage(): any[] {
        return [
            {
                image: this.logoService.getLogo(),
                width: '1000',
                opacity: 0.03
            }
        ]
    }

    private setFonts(): void {
        pdfFonts.pdfMake.vfs['AkaAcidCanterBold'] = strAkaAcidCanterBold
        pdfFonts.pdfMake.vfs['PFHandbookPro'] = strPFHandbookPro
        pdfMake.fonts = {
            AkaAcidCanterBold: { normal: 'AkaAcidCanterBold' },
            PFHandbookPro: { normal: 'PFHandbookPro' }
        }
    }

    //#endregion

}

