import {Component, OnInit} from '@angular/core';
import {ParkingDataService} from '../../services/parking-data/parking-data.service';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

@Component({
  selector: 'app-parking-list',
  standalone: true,
  templateUrl: './parking-list.component.html',
  styleUrls: ['./parking-list.component.css']
})
export class ParkingListComponent implements OnInit {
  parkingData: any[] = [];
  selectedMapParking: any = null;
  isMapModalOpen = false;


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

  openMapModal(parking: any) {
    this.selectedMapParking = parking;
    this.isMapModalOpen = true;

    setTimeout(() => {
      mapboxgl.accessToken = 'TOKEN';
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [parking.location.longitude, parking.location.latitude],
        zoom: 14
      });

      new mapboxgl.Marker()
        .setLngLat([parking.location.longitude, parking.location.latitude])
        .addTo(map);
    }, 100);
  }

  closeModal() {
    this.isMapModalOpen = false;
  }
}
