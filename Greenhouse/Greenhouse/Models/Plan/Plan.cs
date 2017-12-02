using System;
using System.Collections.Generic;
using Newtonsoft.Json;



namespace Greenhouse.Models.Plan
{
  public class Plan
  {
    private static int id = 0;

    private int _id;
    private string _name;
    private List<Period> _periods;
    private DateTime _Beginning;
    private DateTime _End;

    public Plan()
    {
      _id = id++;
      _name = "New plan";
      _Beginning = DateTime.Now;
      _End = _Beginning.AddHours(24);
      _periods = new List<Period>();
      _periods.Add(new Period(_Beginning, _End));
      _periods.Add(new Period(_Beginning, _End));
    }

    public Period AddPeriod() {
      Period per = new Period();
      _periods.Add(per);
      return per;
    }

    public Period DeletePeriod(int period_id)
    {
      Period per = _periods.Find(x => x.ID == period_id);
      _periods.Remove(per);
      return per;
    }

    public string ToJson() {
      return JsonConvert.SerializeObject(this);
      //var settings = new JsonSerializerSettings() { ContractResolver = new AllFieldsContractResolver() };
      //return JsonConvert.SerializeObject(this, settings);
    }

    public string Save() 
    {
      var settings = new JsonSerializerSettings() { ContractResolver = new AllFieldsContractResolver() };

      String output = JsonConvert.SerializeObject(this, settings);
      return output;
    }


    public int ID {
      get => _id;
    }

    public string Name {
      get => _name;
      set => _name = value;
    }

    public List<Period> Periods
    {
      get => _periods;
      set => _periods = value;
    }

    public DateTime GetBeginning() {
      return _Beginning;
    }
  }
}
