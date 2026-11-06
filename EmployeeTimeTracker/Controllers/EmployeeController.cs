using EmployeeTimeTracker.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeTimeTracker.Controllers;

public class EmployeeController : Controller
{
    private readonly TimeEntryService _timeEntryService;
    private readonly ChartService _chartService;
    private readonly IWebHostEnvironment _environment;

    public EmployeeController(
        TimeEntryService timeEntryService,
        ChartService chartService,
        IWebHostEnvironment environment)
    {
        _timeEntryService = timeEntryService;
        _chartService = chartService;
        _environment = environment;
    }

    public async Task<IActionResult> Index()
    {
        var employees = await _timeEntryService.GetEmployeeStatsAsync();

        var chartPath = Path.Combine(_environment.WebRootPath, "chart.png");
        _chartService.SavePieChart(employees, chartPath);

        return View(employees);
    }
}
