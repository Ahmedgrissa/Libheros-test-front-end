import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/roomModel';

@Injectable()
export class RoomProvider {

    constructor(
        private http: HttpClient,
    ) { }

    getAvailableRooms(bookingDateAndTime, capacity, selectedEquipements): Observable<Room[]> {
        console.log('Hello RoomProvider');
        const params = new HttpParams()
            .set('filters', JSON.stringify(
                {
                    bookingDateAndTime: bookingDateAndTime,
                    capacity: capacity,
                    equipements: selectedEquipements
                }));
        const options = { params };
        return this.http.get<Room[]>('http://localhost:3000/api/room/', options);
    }

    book(date, startingTime, endingTime, roomId): Observable<Room> {
        const params = new HttpParams()
            .set('filters', JSON.stringify(
                { date: date, startingTime: startingTime, endingTime: endingTime }
            ));
        const options = { params };
        return this.http.put<Room>('http://localhost:3000/api/room/' + roomId, options);
    }

}
