import { VoucherPassengerDto } from './voucher-passenger-dto'

export interface VoucherDto {

    date: string
    refNo: string
    ticketNo: string
    destinationDescription: string
    customerDescription: string
    pickupPointDescription: string
    pickupPointExactPoint: string
    pickupPointTime: string
    driverDescription: string
    remarks: string
    qr: string
    passengers: VoucherPassengerDto[]
    adults: string
    kids: string
    free: string
    totalPax: string
    validPassengerIcon: string

}