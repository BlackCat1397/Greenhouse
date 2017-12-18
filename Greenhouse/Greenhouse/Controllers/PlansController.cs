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

    [HttpGet]
    public string ActivatePlan(int id)
    {
      return Program.ghs.ActivatePlan(id).ToString();
    }

    [HttpPost]
    public string Rename([FromQuery]int id, [FromQuery]string new_name)
    {
      Program.ghs.GetPlan(id).Name = new_name;
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
      return Program.ghs.GetPlan(id).AddPeriod().ToJson();
    }

    [HttpPost]
    public string DeletePeriod([FromQuery]int plan_id, [FromQuery]int period_id) {
      Program.ghs.GetPlan(plan_id).DeletePeriod(period_id);
      return "OK";
    }

    [HttpPost]
    public string EditPeriod(string name, int days, int hours, double air_temp, int plan_id, int period_id,
                             double water_temp, double ph, double humidity, double lighting, double fertilization)
    {
      
      Period per = Program.ghs.GetPlan(plan_id).GetPeriod(period_id);

      if (air_temp != 0)
        per.Params.AirTemperature = air_temp;
      if (water_temp != 0)
        per.Params.WaterTemperature = water_temp;
      if (ph != 0)
        per.Params.PH = ph;
      if (fertilization != 0)
        per.Params.Fertilization = fertilization;
      if (humidity != 0)
        per.Params.AirTemperature = humidity;
      if (lighting != 0)
        per.Params.AirTemperature = lighting;
      
      per.Name = name;


      double NewDuration = new TimeSpan(days, hours, 0, 0).TotalHours;

      if (NewDuration != 0)
        per.Duration = NewDuration;

      return per.ToJson();
    }

    [HttpPost]
    public string MovePeriod(int plan_id, int period_id, int index, int prev_index) {
      Period per = Program.ghs.GetPlan(plan_id).Periods.Find(x => x.ID == period_id);
      Program.ghs.GetPlan(plan_id).Periods.RemoveAt(prev_index);
      Program.ghs.GetPlan(plan_id).Periods.Insert(index, per);

      return "OK";
    }
  }
}
