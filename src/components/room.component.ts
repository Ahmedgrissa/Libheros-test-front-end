import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Room } from '../models/roomModel';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.css']
})
export class RoomComponent {

    @Input() room: Room;
    @Output() bookRoom = new EventEmitter();

    onBook() {
        console.log('To Emit', this.room);
        this.bookRoom.emit();
    }
}
