using Microsoft.AspNetCore.Mvc;

namespace EmployeeTimeTracker.Controllers;

// Kept apart from EmployeeController, which can't be created when the API key is missing.
public class ErrorController : Controller
{
    public IActionResult Index()
    {
        return View("Error");
    }
}
