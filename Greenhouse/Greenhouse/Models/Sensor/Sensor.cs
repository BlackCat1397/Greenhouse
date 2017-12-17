using System;
namespace Greenhouse.Models.Equipment
{
  public class Sensor
  {
    static int last_id = 0;

    private bool placed;
    private string parameter;
    private int _id;
    private double value;

    public Sensor()
    {
      _id = last_id++;
      placed = false;

      parameter = "air";
    }

    public Sensor(string par)
    {
      _id = last_id++;
      placed = false;
      this.Param = par; 
    }

    public int ID {
      get => _id; 
    }

    public bool Placed
    {
      get => placed;
      set => placed = value;
    }

    public string Param
    {
      get => parameter;
      set => parameter = value;
    }

    public double Value {
      get => value;
      set => this.value = value;
    }
  }
}
