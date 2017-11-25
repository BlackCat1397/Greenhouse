using System;
namespace Greenhouse
{
  public class Period
  {
    private DateTime beginning;
    private DateTime end;
    private Parameters parameters;

    public Period()
    {
    }

    public Period(DateTime beginning, DateTime end)
    {
      this.beginning = beginning;
      this.end = end;
    }
  }
}
