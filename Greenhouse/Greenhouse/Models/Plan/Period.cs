using System;
using Newtonsoft.Json;

namespace Greenhouse.Models.Plan
{
  public class Period
  {
    private static int id = 0;

    public String Name;
    private int _id;
    private DateTime beginning;
    private DateTime end;
    private Parameters _params;

    public Period()
    {
      beginning = new DateTime(2000, 1, 1);
      end = new DateTime(2000, 1, 24);
      this.Name = "PeR";
      _params = new Parameters();
      _id = id++;
    }

    public Period(DateTime beginning, DateTime end)
    {
      this.beginning = beginning;
      this.end = end;
      this.Name = "PeRiOd";
      this.Params = new Parameters();
      this._id = id++;
    }

    public string ToJson()
    {
      return JsonConvert.SerializeObject(this);
     }

    public Parameters Params{
      get => _params;
      set => _params = value;
    }

    //public double Duration()
    //{
    //  return (end - beginning).TotalHours;
    //}

    public int ID {
      get => _id; 
    }

    [JsonProperty(PropertyName = "Duration")]
    public double Duration {
      get => (end - beginning).TotalHours;
    }
  }
}
