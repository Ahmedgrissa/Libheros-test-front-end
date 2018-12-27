export class Room {
    constructor(
        public _id: string,
        public name: string,
        public description?: string,
        public capacity?: number,
        public equipements?: Equipement[],
        public available?: boolean,
        public bookings?: Booking
    ) { }
}
export class Equipement {
    constructor(
        name: string
    ) { }
}

export class Booking {
    constructor(
        date: string,
        startingTime: string,
        endingTime: string
    ) { }
}
