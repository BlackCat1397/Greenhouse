using System;

namespace Greenhouse.Models.Equipment
{
  public class Device
  {

    static int last_id = 0;

    private const double cond_const = 2;
    private const double heater_const = 3;
    private const double min_air_temp = 18;
    private const double max_air_temp = 27;

    private int _id;
    private int _x;
    private int _y;
    string type;
    private bool placed;


    public Device(string t)
    {
      _id = last_id++;
      placed = false;
      this.Type = t;
    }

    public int ID
    {
      get => _id;
    }

    public bool Placed
    {
      get => placed;
    }

    public bool Place(int x, int y)
    {
      placed = true;
      _x = x;
      _y = y;
      return true;
    }

    public bool Unplace()
    {
      if (!placed)
        return false;

      placed = false;
      return true;
    }

    public string Type
    {
      get => type;
      set => type = value;
    }

    private int Dist(int x, int y) {
      int dx = Math.Abs(_x - x);
      int dy = Math.Abs(_y - y);
      return dx + dy;
      if (dx == dy && dy != 0)
        return dx + dy - 1;
      else
        return dx + dy;
    }

    public void Work()
    {
      for (int i = 0; i < Field.Field.width; i++)
        for (int j = 0; j < Field.Field.length; j++)
        {
          Greenhouse.Models.Plan.Parameters cell = Program.ghs.field.cell(i, j);
          int dist = this.Dist(i, j);
          switch (type)
          {
            case "conditioner":
              if ((cell.AirTemperature - (dist != 0 ? cond_const / Math.Pow(dist, 1.2) : cond_const)) > min_air_temp)
                cell.AirTemperature -= dist != 0 ? cond_const / Math.Pow(dist, 1.2) : cond_const;
              else
                cell.AirTemperature = min_air_temp;
              break;  

            case "heater":
              if ((cell.AirTemperature + (dist != 0 ? heater_const / Math.Pow(dist, 1.2) : heater_const)) < max_air_temp)
                cell.AirTemperature += dist != 0 ? heater_const / Math.Pow(dist, 1.2) : heater_const;
              else
                cell.AirTemperature = max_air_temp;
              break;
            default:
              return;
          }
        }
    }
  }
}
