using System;

namespace Greenhouse.Models.Equipment
{
  public class Device
  {

    static int last_id = 0;

    private const double cond_const = 2;
    private const double heater_const = 3;
    private const double light_const = 100;
    private const double fert_const = 3;
    private const double hum_const = 7;

    private int _id;
    private int _x;
    private int _y;
    private string type;
    private bool placed;
    private bool on;
    private string targetParamType;

    public Device(string t)
    {
      _id = last_id++;
      placed = false;
      on = false;
      this.Type = t;
      this.TargetParamType = t;
    }

    public int X
    {
      get => _x;
    }

    public int Y
    {
      get => _y;
    }

    public int ID
    {
      get => _id;
    }

    public bool Placed
    {
      get => placed;
    }

    public bool On
    {
      get;
    }

    public string State
    {
      get
      {
        if (on)
          return "On";
        else
          return "Off";
      }
    }

    public bool Switch(string s)
    {
      if (s == "on")
      {
        if (!on)
          Program.ghs.Log.AddEvent(Program.ghs.Time, "info", this.Type + " " + this.ID + " switched <span class='state state-on'>on</span>.");
        on = true;
      }
      else
      {
        if (on)
          Program.ghs.Log.AddEvent(Program.ghs.Time, "info", this.Type + " " + this.ID + " switched <span class='state state-off'>off</span>.");
        on = false;
      }

      return On;
    }

    public bool Place(int x, int y)
    {
      placed = true;
      _x = x;
      _y = y;
      Program.ghs.Log.AddEvent(Program.ghs.Time, "info", this.Type
                               + " " + this.ID + " placed (" + this._x + ", " + this._y + ").");
      return true;
    }

    private void SensorMsg(string type, bool state, Sensor sens)
    {
      string msg = null;
      string val = Math.Round(sens.Value, 1).ToString();
      string eType = "warning";

      if (state)
        switch (type)
        {
          case "conditioner":
            msg = "Too warm(" + val + ").";
            break;
          case "heater":
            msg = "Too cold(" + val + ").";
            break;
          case "humidifier":
            msg = "Too dry.";
            eType = "alert";
            break;
          case "fertilizer":
            msg = "Low fertilization.";
            eType = "alert";
            break;
          case "lighter":
            msg = "Too dark.";
            eType = "alert";
            break;
        }
      else
        switch (type)
        {
        }
      if (msg != null)
        Program.ghs.Log.AddEvent(Program.ghs.Time, eType, "Sensor " + sens.ID + " - " + msg);
    }

    public bool Switch(string s, Sensor sens)
    {
      if (s == "on")
      {
        if (!on)
        {
          SensorMsg(this.Type, true, sens);
          Program.ghs.Log.AddEvent(Program.ghs.Time, "info", this.Type + " " + this.ID + " switched <span class='state state-on'>on</span>.");
        }
        on = true;
      }
      else
      {
        if (on)
        {
          SensorMsg(this.Type, false, sens);
          Program.ghs.Log.AddEvent(Program.ghs.Time, "info", this.Type + " " + this.ID + " switched <span class='state state-off'>off</span>.");
        }
        on = false;
      }

      return On;
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

    public string TargetParamType
    {
      get => targetParamType;
      set
      {
        switch (value)
        {
          case "conditioner":
            targetParamType = "air";
            break;

          case "heater":
            targetParamType = "air";
            break;

          case "lighter":
            targetParamType = "light";
            break;

          case "fertilizer":
            targetParamType = "fert";
            break;

          case "humidifier":
            targetParamType = "humidity";
            break;

          default:
            return;
        }
      }
    }

    private int Dist(int x, int y)
    {
      int dx = Math.Abs(_x - x);
      int dy = Math.Abs(_y - y);
      return dx + dy == 0 ? 1 : dx + dy;
    }


    public void Work()
    {
      if (type == "fertilizer")
        Console.WriteLine("!");
      if (on)
        for (int i = 0; i < Field.Field.width; i++)
          for (int j = 0; j < Field.Field.length; j++)
          {
            Greenhouse.Models.Plan.Parameters cell = Program.ghs.field.cell(i, j);
            int dist = this.Dist(i, j);
            switch (type)
            {
              case "conditioner":
                cell.AirTemperature -= cond_const / Math.Pow(dist, 1.2);
                cell.WaterTemperature = cell.AirTemperature - 2;
                break;

              case "heater":
                cell.AirTemperature += heater_const / Math.Pow(dist, 1.2);
                cell.WaterTemperature = cell.AirTemperature - 2;
                break;

              case "lighter":
                double val_from_this = light_const / Math.Pow(dist, 0.6);
                if (val_from_this > cell.Lighting)
                  cell.Lighting = val_from_this;
                break;

              case "fertilizer":
                double df = fert_const / Math.Pow(dist, 1.2);
                cell.Fertilization += df;
                cell.PH += df / 20;
                break;

              case "humidifier":
                double dh = hum_const / Math.Pow(dist, 1.2);
                cell.Humidity += dh;
                break;

              default:
                return;
            }
          }
    }
  }
}
