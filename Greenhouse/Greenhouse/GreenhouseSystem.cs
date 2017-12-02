using System;
using System.Collections.Generic;
using Greenhouse.Models.Plan;

namespace Greenhouse.System
{
  public class GreenhouseSystem
  {
    private Period _currentPeriod;
    private List<Plan> plans;

    public GreenhouseSystem() {
      _currentPeriod = null;
      plans = new List<Plan>();
    }

    public bool Configure() {
      Plan pl = new Plan();
      plans.Add(pl);

      return true;
    }

    public Plan AddPlan() {
      Plan pl = new Plan();
      plans.Insert(0, pl);

      return pl;
    }

    public List<Plan> Plans {
      get => plans;
    }

    public Plan UpdatePlan(int id) {
      return plans.Find(x => x.ID == id);
    }

    public bool DeletePlan(int id) {
      Plan pl = plans.Find(x => x.ID == id);
      return plans.Remove(pl);
    }
  }
}
