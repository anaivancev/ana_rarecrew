import { Component, inject, signal } from '@angular/core';
import { EmployeeTable } from './components/employee-table/employee-table';
import { Employee } from './models/employee';
import { EmployeeHours } from './services/employee-hours';

@Component({
  imports: [EmployeeTable],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly employeeHours = inject(EmployeeHours);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);

  constructor() {
    this.employeeHours.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.loading.set(false);
      },
      error: () => {
        this.loadFailed.set(true);
        this.loading.set(false);
      },
    });
  }
}
