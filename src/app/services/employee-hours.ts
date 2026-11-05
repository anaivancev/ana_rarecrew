import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Employee } from '../models/employee';
import { TimeEntry } from '../models/time-entry';

@Service()
export class EmployeeHours {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}?code=${environment.apiKey}`;

  getEmployees(): Observable<Employee[]> {
    return this.http.get<TimeEntry[]>(this.url).pipe(map((entries) => this.toEmployees(entries)));
  }

  private toEmployees(entries: TimeEntry[]): Employee[] {
    const hoursByName = new Map<string, number>();

    for (const entry of entries) {
      if (!entry.EmployeeName || entry.DeletedOn) {
        continue;
      }

      const start = new Date(entry.StarTimeUtc).getTime();
      const end = new Date(entry.EndTimeUtc).getTime();
      const hours = (end - start) / 3_600_000;

      if (hours <= 0) {
        continue;
      }

      const soFar = hoursByName.get(entry.EmployeeName) ?? 0;
      hoursByName.set(entry.EmployeeName, soFar + hours);
    }

    return Array.from(hoursByName, ([name, totalHours]) => ({ name, totalHours }));
  }
}
