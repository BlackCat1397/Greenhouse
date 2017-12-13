using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Greenhouse.Controllers
{
  public class EquipmentController : Controller
  {
    // GET: /<controller>/
    public IActionResult Index()
    {
      return View();
    }

    public string GetSensors()
    {
      return "{" + Program.ghs.field.GetUnplacedSensors() + ", " + Program.ghs.field.GetPlacedSensors() + "}"; 
    }

    public string PlaceSensor(int x, int y, string type)
    {
      //запрос получили, надо обработать
      if (Program.ghs.field.PlaceSensor(type, x, y) == null)
        return "fail";
      else
        return "{\"x\":" + x.ToString() + ", \"y\":" + y.ToString() + ", \"type\":\"" + type + "\"}";
    }

    [HttpDelete]
    public string UnplaceSensor(int x, int y) {
      return Program.ghs.field.UnplaceSensor(x, y);
    }

    public string GetDevices()
    {
      return "{" + Program.ghs.field.GetUnplacedDevices() + ", " + Program.ghs.field.GetPlacedDevices() + "}";
    }

    public string PlaceDevice(int x, int y, string type)
    {
      //запрос получили, надо обработать
      if (Program.ghs.field.PlaceDevice(type, x, y) == null)
        return "fail";
      else
        return "{\"x\":" + x.ToString() + ", \"y\":" + y.ToString() + ", \"type\":\"" + type + "\"}";
    }

    public void RemoveDevice(int id)
    {

    }
  }
}
