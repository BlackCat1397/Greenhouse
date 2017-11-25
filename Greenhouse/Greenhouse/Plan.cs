using System;
using Newtonsoft.Json;



namespace Greenhouse
{
  public class Plan
  {
    public string name;
    private Period periods;
    private DateTime beginning;
    private DateTime end;

    public Plan()
    {
      name = "New plan";
      beginning = new DateTime(2018, 1, 1);
      end = new DateTime(2019, 1, 1);
      //periods = new Period[2];
      periods = new Period(beginning, end);
      periods = new Period(beginning, end);
    }

    public string Save() 
    {
      var settings = new JsonSerializerSettings() { ContractResolver = new AllFieldsContractResolver() };

      String output = JsonConvert.SerializeObject(this, settings);
      return output;
    }

    public DateTime GetBeginning() {

      return beginning;
    }
  }
}
