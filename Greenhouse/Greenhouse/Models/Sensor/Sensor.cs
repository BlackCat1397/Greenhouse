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
    private int _x;
    private int _y;

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

    public int Dist(int x, int y)
    {
      int dx = Math.Abs(_x - x);
      int dy = Math.Abs(_y - y);
      return dx + dy == 0 ? 1 : dx + dy;
    }

    public bool Place(int x, int y)
    {
      placed = true;
      _x = x;
      _y = y;
      TimeSpan t = Program.ghs.Time;
      Program.ghs.Log.AddEvent(t, "info", this.Param
                               + " sensor " + this.ID + " placed (" + this._x + ", " + this._y + ").");

      return true;
    }

    public bool Unplace()
    {
      if (!placed)
        return false;

      placed = false;
      return true;
    }
  }
}
