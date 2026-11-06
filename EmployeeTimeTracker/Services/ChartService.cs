using EmployeeTimeTracker.Models;
using ScottPlot;

namespace EmployeeTimeTracker.Services;

public class ChartService
{
    private static readonly Color[] SliceColors =
    [
        Color.FromHex("#2a78d6"),
        Color.FromHex("#eb6834"),
        Color.FromHex("#1baf7a"),
        Color.FromHex("#eda100"),
        Color.FromHex("#e87ba4"),
        Color.FromHex("#008300"),
        Color.FromHex("#6250d6"),
        Color.FromHex("#e34948"),
        Color.FromHex("#00a3bf"),
        Color.FromHex("#b5651d")
    ];

    public void SavePieChart(List<EmployeeStats> employees, string filePath)
    {
        var slices = employees
            .Select((employee, index) => new PieSlice
            {
                Value = employee.TotalHours,
                // Labels on very thin slices overlap, and the legend shows every percentage anyway.
                Label = employee.Percentage >= 2 ? $"{employee.Percentage:F1}%" : "",
                LegendText = $"{employee.Name} ({employee.Percentage:F1}%)",
                FillColor = SliceColors[index % SliceColors.Length]
            })
            .ToList();

        var plot = new Plot();

        var pie = plot.Add.Pie(slices);
        pie.SliceLabelDistance = 1.15;
        pie.LineColor = Colors.White;
        pie.LineWidth = 2;

        plot.ShowLegend(Edge.Right);
        plot.Axes.Frameless();
        plot.Title("Share of total time worked");
        plot.HideGrid();
        plot.Font.Automatic();

        plot.SavePng(filePath, 800, 480);
    }
}
