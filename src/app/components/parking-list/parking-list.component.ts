import {Component, OnInit} from '@angular/core';
import {ParkingDataService} from '../../services/parking-data/parking-data.service';

@Component({
  selector: 'app-parking-list',
  standalone: true,
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
        this.parkingData = this.sortParkingData(
          this.parkingDataService.combineParkingData(parkingData, availabilityData));
      });
    });
  }

  private sortParkingData(parkingData: any[]): any[] {
    return parkingData.sort((a, b) => {
      return (b.availableSpots > 0 ? 1 : 0) - (a.availableSpots > 0 ? 1 : 0);
    });
  }
}
