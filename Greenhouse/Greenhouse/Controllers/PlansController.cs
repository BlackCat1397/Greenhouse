using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Greenhouse.Models.Plan;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Greenhouse.Controllers
{
  public class PlansController : Controller
  {
    [HttpPost]
    public string Create()
    {
      Plan pl = Program.ghs.AddPlan();

      return pl.ToJson();
    }

    // GET: /<controller>/
    public IActionResult Status()
    {
      List<Plan> plans = Program.ghs.Plans;

      return View(plans);
    }

    [HttpPost]
    public string Rename([FromQuery]int id, [FromQuery]string new_name)
    {
      Program.ghs.UpdatePlan(id).Name = new_name;
      return "OK";
    }

    [HttpDelete]
    public string Delete(int id)
    {
      Program.ghs.DeletePlan(id);
      return id.ToString();
    }

    [HttpPost]
    public string AddPeriod(int id)
    {
      return Program.ghs.UpdatePlan(id).AddPeriod().ToJson();
    }

    [HttpPost]
    public string DeletePeriod([FromQuery]int plan_id, [FromQuery]int period_id) {
      Program.ghs.UpdatePlan(plan_id).DeletePeriod(period_id);
      return "OK";
    }

    [HttpPost]
    public string EditPeriod(string name, int days, int hours, double air_temp, int plan_id, int period_id,
                             double water_temp, double ph, double humidity, double lighting, double fertilization)
    {
      Parameters parameters = new Parameters(air_temp, water_temp, ph, humidity, lighting, fertilization);
      Period per = Program.ghs.UpdatePlan(plan_id).GetPeriod(period_id);
      per.Params = parameters;


      return per.ToJson();
    }
  }
}
