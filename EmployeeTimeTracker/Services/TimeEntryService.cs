using EmployeeTimeTracker.Models;

namespace EmployeeTimeTracker.Services;

public class TimeEntryService
{
    private readonly HttpClient _httpClient;
    private readonly string _url;

    public TimeEntryService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;

        var apiUrl = configuration["ApiSettings:ApiUrl"]
            ?? throw new InvalidOperationException("ApiSettings:ApiUrl is missing from appsettings.json.");
        var apiKey = configuration["ApiSettings:ApiKey"]
            ?? throw new InvalidOperationException("API key is missing. Set the ApiSettings__ApiKey environment variable.");

        _url = $"{apiUrl}?code={Uri.EscapeDataString(apiKey)}";
    }

    public async Task<List<EmployeeStats>> GetEmployeeStatsAsync()
    {
        var entries = await _httpClient.GetFromJsonAsync<List<TimeEntry>>(_url);
        return ToEmployeeStats(entries ?? []);
    }

    private static List<EmployeeStats> ToEmployeeStats(List<TimeEntry> entries)
    {
        var employees = entries
            .Where(e => !string.IsNullOrEmpty(e.EmployeeName) && e.DeletedOn == null && e.EndTimeUtc > e.StarTimeUtc)
            .GroupBy(e => e.EmployeeName!)
            .Select(group => new EmployeeStats
            {
                Name = group.Key,
                TotalHours = group.Sum(e => (e.EndTimeUtc - e.StarTimeUtc).TotalHours)
            })
            .OrderByDescending(employee => employee.TotalHours)
            .ToList();

        var allHours = employees.Sum(employee => employee.TotalHours);

        foreach (var employee in employees)
        {
            employee.Percentage = employee.TotalHours / allHours * 100;
        }

        return employees;
    }
}
