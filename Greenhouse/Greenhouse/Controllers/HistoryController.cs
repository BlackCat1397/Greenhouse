using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Greenhouse.Controllers
{
  public class HistoryController : Controller
  {
    // GET: /<controller>/
    public IActionResult Index()
    {
      return View();
    }

    // GET: /<controller>/
    public IActionResult Log()
    {
      return View("Log");
    }

    public string GetLog()
    {
      return Program.ghs.Log.ToJson();
    }

    public string GetUnseenLog()
    {
      return Program.ghs.Log.UnseenToJson();
    }

    public void MarkSeen(){
      Program.ghs.Log.MarkSeen();
    }
  }
}
