import { Room, Equipement } from './../../../models/roomModel';
import { Component } from '@angular/core';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RoomProvider } from '../../../providers/room-provider'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private roomProvider: RoomProvider,
  ) { }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    minYear: 2018,
    showClearDateBtn: false,
    disableUntil: this.getPreviousDayDate(), // All dates are disabled until current date
    markCurrentDay: true
  };
  public startingTime = { hour: 8, minute: 0 };
  public endingTime = { hour: 9, minute: 0 };
  public showFilters = false;
  public buttonIsActive = false;
  public availableRooms: Room[] = [];
  public capacity = 0;
  // The ARRAY OF EQUIPEMENTS FILTER
  public filterEquipements = [{ 'name': 'PC', checked: false },
  { 'name': 'TV', checked: false }, { 'name': 'Retro Projecteur', checked: false }];
  public selectedEquipements: Equipement[] = [];

  public date: any = {};

  // CONTROL OF TIME AND CHECK IF STARTING TIME IS LESS THEN ENDING TIME
  startCtrl = new FormControl('', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (this.endingTime) {
      if (value.hour > this.endingTime.hour || (value.hour === this.endingTime.hour && value.minute > this.endingTime.minute)) {
        this.buttonIsActive = false;
        this.endCtrl.setValue({ hour: value.hour + 1, minute: value.minute });
      } else {
        this.buttonIsActive = true;
      }
    }
  });

  endCtrl = new FormControl('', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (this.startingTime) {
      if (value.hour < this.startingTime.hour || (value.hour === this.startingTime.hour && value.minute < this.startingTime.minute)) {
        this.buttonIsActive = false;
        this.startCtrl.setValue({ hour: value.hour, minute: value.minute });
      } else {
        this.buttonIsActive = true;
      }
    }
  });

  getPreviousDayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1).valueOf();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { year: year, month: month, day: day };
  }

  // THIS FUNCTION IS CALLED AFTER CHOOSING A TIME TO SHOW THE FILTERS
  onDateChanged(event: IMyDateModel) {
    this.showFilters = true;
    this.date = event.formatted;
    // IF DATE IS CHANGED THE ALREADY LOADED ROOMS DISAPPEAR
    this.availableRooms = [];
  }

  getRooms() {
    this.availableRooms = [];
    if (this.startingTime && this.endingTime && this.date) {
      this.selectedEquipements = this.filterEquipements.filter(equipement => equipement.checked)
        .map(equipement => {
          return { name: equipement.name };
        });
      const bookingDateAndTime = {
        date: this.date.formatted,
        startingTime: this.startingTime,
        endingTime: this.endingTime
      };
      this.spinner.show();
      this.roomProvider.getAvailableRooms(bookingDateAndTime, this.capacity, this.selectedEquipements).subscribe(
        rooms => {
          this.spinner.hide();
          if (rooms.length) {
            this.availableRooms = rooms;
            const toastMessage = rooms.length + (rooms.length === 1 ? ' salle disponible ' : ' salles disponibles');
            this.toastrService.success(toastMessage);
          } else {
            this.toastrService.info('Aucune salle n\'est disponible');
          }
        },
        error => {
          this.spinner.hide();
          this.toastrService.error('Erreur de récupération des salles, veuillez réessayer !', 'Erreur');
        }
      );
    }
  }

  bookRoom(roomId: string) {
    const indexOfRoom = this.availableRooms.findIndex((room) => room._id === roomId);
    this.spinner.show();
    this.roomProvider.book(this.date.formatted, this.startingTime, this.endingTime, roomId).subscribe(
      () => {
        // Remove Room View Booking is successfull
        this.availableRooms.splice(indexOfRoom, 1);
        this.spinner.hide();
        this.toastrService.success('Réservation effectuée avec succès !');
      },
      // In case of an error Remove spinner
      () => {
        this.spinner.hide();
        this.toastrService.error('Erreur dans la réservation, veuillez réssayer !', 'Erreur', {
          timeOut: 3000
        });
      });
  }

}
