using System;
//using System.Threading;
//using System.Threading.Tasks;
using System.Timers;


using System.Collections.Generic;
using Greenhouse.Models.Plan;
using Greenhouse.Models.Equipment;
using Greenhouse.Models.Field;

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
    private Timer timer;

    public GreenhouseSystem() {
      _currentPeriod = null;
      plans = new List<Plan>();
      field = new Field();
      time = new TimeSpan();

      timer = new Timer();
      InitTimer();
    }

    public bool Configure() {
      Plan pl = new Plan();
      plans.Add(pl);
      ActivatePlan(pl.ID);

      return true;
    }

    private void work(object source, ElapsedEventArgs e) {
      Console.WriteLine("1337 5|>34|<");
      time += new TimeSpan(0, 30, 0);
      field.Work();
    }

    private void InitTimer() {
      // Tell the timer what to do when it elapses
      timer.Elapsed += new ElapsedEventHandler(work);
      // Set it to go off every five seconds
      timer.Interval = 10000;
    }

    public void Start() {
      timer.Enabled = true;
    }

    public void Stop()
    {
      timer.Enabled = false;
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

    public void work() {
      
    }
  }
}
