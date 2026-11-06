namespace EmployeeTimeTracker.Models;

public class TimeEntry
{
    public string? EmployeeName { get; set; }

    // "StarTimeUtc" is misspelled in the API response, so the name has to match it.
    public DateTime StarTimeUtc { get; set; }

    public DateTime EndTimeUtc { get; set; }

    public DateTime? DeletedOn { get; set; }
}
