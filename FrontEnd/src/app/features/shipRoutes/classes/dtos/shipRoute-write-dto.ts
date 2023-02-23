export interface ShipRouteWriteDto {

    id: number
    description: string
    fromPort: string
    fromTime: string
    viaPort: string
    viaTime: string
    toPort: string
    toTime: string
    isActive: boolean

}
