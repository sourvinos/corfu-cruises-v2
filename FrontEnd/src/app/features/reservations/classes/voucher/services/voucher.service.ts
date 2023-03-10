import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { LogoService } from '../../services/logo.service'
import { VoucherDto } from '../dtos/voucher-dto'
// Fonts
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { strPFHandbookPro } from '../../../../../../assets/fonts/PF-Handbook-Pro.Base64.encoded'
import { strAkaAcidCanterBold } from '../../../../../../assets/fonts/Aka-Acid-CanterBold.Base64.encoded'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({ providedIn: 'root' })

export class VoucherService extends HttpDataService {

    constructor(http: HttpClient, private logoService: LogoService) {
        super(http, '/api/voucher')
    }

    //#region public methods

    public createVoucherOnClient(voucher: VoucherDto): void {
        this.setFonts()
        const rows = []
        rows.push([{ text: '' }, { text: '' }])
        rows.push([{ text: 'Passengers', colSpan: 2, alignment: 'center', fontSize: 18 }])
        for (const passenger of voucher.passengers) {
            rows.push([{ text: passenger.lastname, style: 'paddingLeft' }, { text: passenger.firstname }])
        }
        const dd = {
            pageMargins: [130, 30, 130, 250],
            pageOrientation: 'portrait',
            pageSize: 'A4',
            content: [
                {
                    table: {
                        body: [
                            [{ image: this.logoService.getLogo('light'), fit: [120, 120], alignment: 'center' }]
                        ],
                        widths: ['100%'],
                        heights: 130,
                    },
                    layout: 'noBorders'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Your reservation for', alignment: 'center' }],
                            [{ text: voucher.destinationDescription, alignment: 'center', fontSize: 20, color: '#060770' }],
                            [{ text: 'is confirmed!', alignment: 'center' }]
                        ],
                        widths: ['100%'],
                        heights: [10, 20, 10],
                    },
                    layout: 'noBorders'
                },
                {
                    table: {
                        headerRows: 0,
                        body: [
                            [{ text: '' }, { text: '' }],
                            [{ text: 'Details', colSpan: 2, alignment: 'center', fontSize: 18 }],
                            [{ text: 'RefNo', style: 'paddingLeft' }, { text: voucher.refNo }],
                            [{ text: 'Ticket No', style: 'paddingLeft' }, { text: voucher.ticketNo }],
                            [{ text: 'Customer', style: 'paddingLeft' }, { text: voucher.customerDescription }],
                            [{ text: 'Remarks', style: 'paddingLeft' }, { text: voucher.remarks }],
                        ],
                        widths: ['50%', '50%'],
                        heights: [0, 15, 15, 15, 15],
                    },
                    layout: 'lightHorizontalLines'
                },
                {
                    table: {
                        headerRows: 0,
                        body: [
                            [{ text: '' }, { text: '' }],
                            [{ text: 'Pickup details', colSpan: 2, alignment: 'center', fontSize: 18, foreground: 'darkslategray' }],
                            [{ text: 'Date', style: 'paddingLeft' }, { text: voucher.date }],
                            [{ text: 'Driver', style: 'paddingLeft' }, { text: voucher.driverDescription }],
                            [{ text: 'Pickup point', style: 'paddingLeft' }, { text: voucher.pickupPointDescription }],
                            [{ text: 'Exact point', style: 'paddingLeft' }, { text: voucher.pickupPointExactPoint }],
                            [{ text: 'Time', style: 'paddingLeft' }, { text: voucher.pickupPointTime }],
                        ],
                        widths: ['50%', '50%'],
                        heights: [0, 20, 15, 15, 15, 15],
                    },
                    layout: 'lightHorizontalLines'
                },
                {
                    table: {
                        headerRows: 0,
                        body: rows,
                        widths: ['50%', '50%']
                    },
                    layout: 'lightHorizontalLines'
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
                    margin: [50, 0, 0, 0]
                },
                paddingTop: {
                    margin: [0, 15, 0, 0]
                },
                small: {
                    fontSize: 8
                },

            },
            defaultStyle: {
                font: 'PFHandbookPro',
            },
            footer: {
                columns: [
                    { width: '*', text: '' },
                    {
                        width: '*',
                        table: {
                            body: [
                                [{ image: voucher.validPassengerIcon, fit: [32, 32], alignment: 'center' }],
                                [{ text: 'Adults: ' + voucher.adults + ' ' + 'Kids: ' + voucher.kids + ' ' + 'Free: ' + voucher.free + ' ' + 'Total pax: ' + voucher.totalPax, alignment: 'center' }],
                                [{ qr: voucher.qr, alignment: 'center', width: 200, style: ['paddingTop'], foreground: 'darkslategray' }],
                                [{ text: 'Problems or questions? Call us at +30 26620 61400', alignment: 'center', style: ['small', 'paddingTop'] }],
                                [{ text: 'or email at info@corfucruises.com', alignment: 'center', style: 'small' }],
                                [{ text: '© Corfu Cruises 2023, Corfu - Greece', alignment: 'center', style: 'small' }],
                            ],
                        },
                        layout: 'noBorders'
                    },
                    { width: '*', text: '' }
                ]
            }
        }
        this.createPdf(dd)
    }

    public createVoucherOnServer(formData: any): Observable<any> {
        return this.http.post<any>(this.url + '/createVoucher', formData)
    }

    public emailVoucher(formData: any): Observable<any> {
        return this.http.post<any>(this.url + '/emailVoucher', formData)
    }

    //#endregion

    //#region private methods   

    private createPdf(document: any): void {
        pdfMake.createPdf(document).open()
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

    //#endregion

}
