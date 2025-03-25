import {Component, OnInit} from '@angular/core';
import {ParkingDataService} from '../../services/parking-data/parking-data.service';
// import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-parking-list',
  standalone: true,
  // imports: [CommonModule], TODO make sure it works ONLY with @ngFor and not @for
  templateUrl: './parking-list.component.html',
  styleUrls: ['./parking-list.component.css']
})
export class ParkingListComponent implements OnInit {
  parkingData: any[] = [];

  constructor(private parkingDataService: ParkingDataService) {
  }

  ngOnInit(): void {
    this.parkingDataService.getParkingList().subscribe(parkingData => {
      this.parkingDataService.getParkingAvailability().subscribe(availabilityData => {
        this.parkingData = this.parkingDataService.combineParkingData(parkingData, availabilityData);
      });
    });
  }
}
