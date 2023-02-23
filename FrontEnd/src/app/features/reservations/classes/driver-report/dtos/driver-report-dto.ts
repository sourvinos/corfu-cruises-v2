import { DriverReportHeaderDto } from './driver-report-header-dto'
import { DriverReportReservationDto } from './driver-report-reservation-dto'

export interface DriverReportDto {

    header: DriverReportHeaderDto
    reservations: DriverReportReservationDto[]

}
