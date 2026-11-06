import { Component, computed, inject, signal } from '@angular/core';
import { EmployeeChart } from './components/employee-chart/employee-chart';
import { EmployeeTable } from './components/employee-table/employee-table';
import { Employee } from './models/employee';
import { EmployeeHours } from './services/employee-hours';

@Component({
  imports: [EmployeeChart, EmployeeTable],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly employeeHours = inject(EmployeeHours);

  private readonly employees = signal<Employee[]>([]);

  protected readonly sortedEmployees = computed(() =>
    [...this.employees()].sort((a, b) => b.totalHours - a.totalHours),
  );
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
