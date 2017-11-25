using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Greenhouse.Controllers
{
  public class PlansController : Controller
  {
    // GET: /<controller>/
    public IActionResult Status()
    {
      IEnumerable<string> plans = Enumerable.Empty<string>();
      plans.Append(Program.output);
      plans.Append(Program.output);

      string[] arr = new string[10];
      arr[0] = Program.output;
      arr[1] = Program.output;

      ViewData["plans"] = plans;
      ViewData["arr"] = arr;
      foreach (var plan in plans) {
        
      }
      ViewData["plans"].ToString();
      return View("status");
    }
  }
}
