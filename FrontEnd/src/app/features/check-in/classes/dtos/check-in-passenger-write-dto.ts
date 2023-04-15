import { Guid } from 'guid-typescript'

export interface CheckInPassengerWriteDto {

    reservationId: Guid
    genderId: number
    nationalityId: number
    occupantId: number
    lastname: string
    firstname: string
    birthdate: string
    remarks: string
    specialCare: string
    isCheckedIn: boolean

}