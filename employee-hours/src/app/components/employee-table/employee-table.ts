import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Employee } from '../../models/employee';

const LOW_HOURS_LIMIT = 100;

@Component({
  imports: [DecimalPipe],
  selector: 'app-employee-table',
  styleUrl: './employee-table.css',
  templateUrl: './employee-table.html',
})
export class EmployeeTable {
  readonly employees = input.required<Employee[]>();

  protected isLowHours(employee: Employee): boolean {
    return employee.totalHours < LOW_HOURS_LIMIT;
  }
}
