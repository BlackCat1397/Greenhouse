using System;
//using System.Threading;
//using System.Threading.Tasks;
using System.Timers;


using System.Collections.Generic;
using Greenhouse.Models.Plan;
using Greenhouse.Models.Equipment;
using Greenhouse.Models.Field;
using Greenhouse.Models.Log;

namespace Greenhouse.System
{
  public class GreenhouseSystem
  {
    private TimeSpan dt = new TimeSpan(1, 0, 0);

    private Period _currentPeriod;
    private Plan _currentPlan;
    public Field field;
    private List<Plan> plans;
    private TimeSpan time;
    private TimeSpan systemTime;
    private Timer timer;
    private Log log;
    private double delta = 0.39999;

    public GreenhouseSystem() {
      _currentPeriod = null;
      plans = new List<Plan>();
      time = new TimeSpan();
      systemTime = new TimeSpan();
      log = new Log();
      field = new Field();


      timer = new Timer();
      InitTimer();
    }

    public bool Configure() {
      Plan pl = new Plan();
      plans.Add(pl);
      ActivatePlan(pl.ID);
      log.AddEvent(time, "info", "System configured.");
                   
      return true;
    }

    private void work(object source, ElapsedEventArgs e) {
      //if(time.TotalHours == 0.5)
        //Stop();
      _currentPeriod = _currentPlan.GetCurrentPeriod(time);
      Console.WriteLine("1337 5|>34|<");
      Console.WriteLine("Time {0}, id {1}", time.ToString(), _currentPeriod.ID);
      time += new TimeSpan(0, 30, 0);
      systemTime += new TimeSpan(0, 30, 0);
      SetDevices();
      field.Work();
    }

    private void SetDevices() {
      Parameters Ok = new Parameters(25, 23, 10, 60, 80, 42);
      //TODO randomize params
      Ok = _currentPeriod.Params;
      List<Device> devices = field.GetPlacedDevicesList;
      foreach (Device d in devices) {
        Sensor nearest = field.GetNearestSensor(d.X, d.Y, d.TargetParamType);
        if (nearest != null)
        {
          switch (d.Type)
          {
            case "conditioner":
              if (nearest.Value > Ok.AirTemperature + delta)
              {
                d.Switch("on", nearest);
              }
              else
                if (nearest.Value < Ok.AirTemperature + delta)
              {
                d.Switch("off", nearest);
              }
              break;

            case "heater":
              if (nearest.Value < Ok.AirTemperature - delta)
              {
                d.Switch("on", nearest);
              }
              else
              {
                d.Switch("off");
              }
              break;

            case "lighter":
              if (nearest.Value < Ok.Lighting - delta * 20)
                d.Switch("on", nearest);
              else
                if (nearest.Value > Ok.Lighting + delta * 20)
                d.Switch("off", nearest);
              break;

            case "fertilizer":
              if (nearest.Value < Ok.Fertilization - delta)
                d.Switch("on", nearest);
              else
                d.Switch("off");
              break;

            case "humidifier":
              if (nearest.Value < Ok.Humidity - delta)
              {
                d.Switch("on", nearest);
              }
              else
              {
                d.Switch("off");
              }
              break;

            default:
              return;
          }
        }
        else
          d.Switch("off");
      }
    }

    private void InitTimer() {
      // Tell the timer what to do when it elapses
      timer.Elapsed += new ElapsedEventHandler(work);
      // Set it to go off every five seconds
      timer.Interval = 5000;
    }

    public void Start() {
      timer.Enabled = true;
      log.AddEvent(time, "info", "\\\"" + _currentPlan.Name + "\\\" started.");
    }

    public void Stop()
    {
      timer.Enabled = false;
      timer.Stop();
      log.AddEvent(time, "info", "System stoped");
    }

    public void Reset()
    {
      Stop();
      time = new TimeSpan(0, 0, 0);
    }

    public Log Log{
      get => log;
    }

    public TimeSpan Time {
      get => time;
    }

    public TimeSpan SystemTime
    {
      get => systemTime;
    }

    public Plan AddPlan() {
      Plan pl = new Plan();
      plans.Insert(0, pl);

      return pl;
    }

    public List<Plan> Plans {
      get => plans;
    }

    public Plan GetPlan(int id) {
      return plans.Find(x => x.ID == id);
    }

    public bool DeletePlan(int id) {
      Plan pl = plans.Find(x => x.ID == id);
      return plans.Remove(pl);
    }

    public bool ActivatePlan(int id) {
      Plan pl = plans.Find(x => x.ID == id);
      if (pl != null)
      {
        _currentPlan = pl;
        return true;
      }
      else
        return false;
    }

    public Period CurrentPeriod {
      get => _currentPeriod;
    }
  }
}
