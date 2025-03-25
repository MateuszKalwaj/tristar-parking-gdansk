import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface ParkingLot {
  id: string;
  name: string;
  shortName: string;
  address: string;
  streetEntrance: string;
  location: Location;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface ParkingAvailability {
  parkingId: string;
  availableSpots: number;
  lastUpdate: string;
}

interface ParkingDataResponse {
  lastUpdate: string;
  parkingLots: ParkingLot[];
}

interface ParkingAvailabilityResponse {
  lastUpdate: string;
  parkingLots: ParkingAvailability[];
}

@Injectable({
  providedIn: 'root'
})

export class ParkingDataService {
  private parkingListURL = 'https://ckan.multimediagdansk.pl/dataset/cb1e2708-aec1-4b21-9c8c-db2626ae31a6/resource/d361dff3-202b-402d-92a5-445d8ba6fd7f/download/parking-lots.json';
  private parkingAvailabilityURL = 'https://ckan2.multimediagdansk.pl/parkingLots';

  constructor(private http: HttpClient) {
  }

  getParkingList(): Observable<ParkingDataResponse> {
    return this.http.get<ParkingDataResponse>(this.parkingListURL);
  }

  getParkingAvailability(): Observable<ParkingAvailabilityResponse> {
    return this.http.get<ParkingAvailabilityResponse>(this.parkingAvailabilityURL);
  }

  combineParkingData(parkingData: ParkingDataResponse, availabilityData: ParkingAvailabilityResponse) {
    return parkingData.parkingLots.map(parking => {
      const availability = availabilityData.parkingLots.find(available => available.parkingId === parking.id);
      return {
        ...parking,
        availableSpots: availability ? availability.availableSpots : 0
      };
    });
  }
}
