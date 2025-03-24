import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ParkingDataService {
  private fileUrl = 'https://ckan.multimediagdansk.pl/dataset/cb1e2708-aec1-4b21-9c8c-db2626ae31a6/resource/d361dff3-202b-402d-92a5-445d8ba6fd7f/download/parking-lots.json';

  constructor(private http: HttpClient) {}

  downloadParkingData() {
    this.http.get(this.fileUrl, { responseType: 'blob' }).pipe(
      tap(blob => this.saveFile(blob, 'parking-lots.json')),
      catchError(error => {
        console.error('Błąd podczas pobierania pliku:', error);
        return of(null);
      })
    ).subscribe();
  }

  private saveFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }
}
