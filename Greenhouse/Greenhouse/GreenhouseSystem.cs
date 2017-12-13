using System;
using System.Collections.Generic;
using Greenhouse.Models.Plan;
using Greenhouse.Models.Equipment;
using Greenhouse.Models.Field;

namespace Greenhouse.System
{
  public class GreenhouseSystem
  {
    private Period _currentPeriod;
    public Field field;
    private List<Plan> plans;

    public GreenhouseSystem() {
      _currentPeriod = null;
      plans = new List<Plan>();
      field = new Field();
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

    public Plan GetPlan(int id) {
      return plans.Find(x => x.ID == id);
    }

    public bool DeletePlan(int id) {
      Plan pl = plans.Find(x => x.ID == id);
      return plans.Remove(pl);
    }
  }
}
