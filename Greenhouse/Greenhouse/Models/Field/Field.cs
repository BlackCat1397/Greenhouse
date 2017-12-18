using System;
using System.Collections.Generic;
using Greenhouse.Models.Equipment;
using Greenhouse.Models.Plan;



namespace Greenhouse.Models.Field
{
  public class Field
  {
    public const int width = 10;
    public const int length = 8;

    private Sensor[,] SensorsField = new Sensor[10, 8];
    private Device[,] DevicesField = new Device[10, 8];
    private Parameters[,] ParametersField = new Parameters[10, 8];


    private List<Sensor> sensors;
    private List<Device> devices;


    public Field()
    {
      sensors = new List<Sensor>();
      devices = new List<Device>();

      sensors.Add(new Sensor("water"));
      sensors.Add(new Sensor("ph"));
      sensors.Add(new Sensor("humidity"));
      sensors.Add(new Sensor("light"));
      sensors.Add(new Sensor("light"));
      sensors.Add(new Sensor());
      sensors.Add(new Sensor());

      devices.Add(new Device("conditioner"));
      devices.Add(new Device("conditioner"));
      devices.Add(new Device("conditioner"));
      devices.Add(new Device("conditioner"));
      devices.Add(new Device("conditioner"));
      devices.Add(new Device("heater"));
      devices.Add(new Device("heater"));
      devices.Add(new Device("heater"));
      devices.Add(new Device("lighter"));
      devices.Add(new Device("lighter"));
      devices.Add(new Device("fertilizer"));
      devices.Add(new Device("humidifier"));

      PlaceSensor(sensors.Find(s => s.ID == 0), 9, 3);
      PlaceSensor(sensors.Find(s => s.ID == 1), 2, 2);

      for (int i = 0; i < width; i++)
        for (int j = 0; j < length; j++)
          ParametersField[i, j] = new Parameters(23, 21, 14, 8, 0, 0);
    }

    public void Work() {
      for (int i = 0; i < width; i++)
        for (int j = 0; j < length; j++)
          ParametersField[i, j].Lighting = 0;
      foreach (Device d in devices)
      {
        if (d.Placed)
          d.Work();
      }
    }

    public Parameters cell(int x, int y) {
      return ParametersField[x, y];
    }

    public void RefreshSensors()
    {
      Dictionary<string, string> Keys = new Dictionary<string, string>(){ { "air", "Air temperature"}, { "ph", "PH" }, { "water", "Water temperature" },
        { "light", "Lighting" }, { "fertilizer", "Fertilizer" }, { "humidity", "Humidity" }};
      for (int i = 0; i < length; i++)
      {
        for (int j = 0; j < width; j++)
        {
          Sensor sens;
          if ((sens = SensorsField[i, j]) != null)
            sens.Value = ParametersField[i, j].ToDict().GetValueOrDefault(Keys.GetValueOrDefault(sens.Param));
        }
      }
    }

    public Device PlaceDevice(string type, int x, int y)
    {
      Device dev = devices.Find(d => !d.Placed && d.Type == type);
      if (dev != null)
      {
        if (PlaceDevice(dev, x, y))
          return dev;
        else
          return null;
      }
      else
        return null;
    }

    public bool PlaceDevice(Device dev, int x, int y) {
      if (DevicesField[x, y] != null)
        return false;
      if (x > width || x < 0)
        return false;
      if (y > length || y < 0)
        return false;
      if (devices.Find(d => !d.Placed) == null)
        return false;

      dev.Place(x, y);
      DevicesField[x, y] = dev;
      return true;
    }

    public string UnplaceDevice(int x, int y)
    {
      string deviceType = DevicesField[x, y].Type;
      DevicesField[x, y].Unplace();
      DevicesField[x, y] = null;
      return deviceType;
    }

    public Sensor PlaceSensor(string param, int x, int y)
    {
      Sensor sens = sensors.Find(s => !s.Placed && s.Param == param);

      if (sens == null)
        return null;
      if (SensorsField[x, y] != null)
        return null;
      if (x > width || x < 0)
        return null;
      if (y > length || y < 0)
        return null;


      SensorsField[x, y] = sens;
      sens.Placed = true;
      return sens;
    }

    public bool PlaceSensor(Sensor sens, int x, int y)
    {
      if (SensorsField[x, y] != null)
        return false;
      if (x > width || x < 0)
        return false;
      if (y > length || y < 0)
        return false;
      if (sensors.Find(s => !s.Placed) == null)
        return false;

      SensorsField[x, y] = sens;
      sens.Placed = true;
      return true;
    }

    public string UnplaceSensor(int x, int y) {
      string sensorType = SensorsField[x, y].Param;
      SensorsField[x, y].Placed = false;
      SensorsField[x, y] = null;
      return sensorType;
    }

    public string GetUnplacedSensors() {
      string res = "\"unplaced\":{";

      List<Sensor> unplaced = sensors.FindAll(s => !s.Placed);
      res += "\"air\":" + unplaced.FindAll(s => s.Param == "air").Count + ", ";
      res += "\"water\":" + unplaced.FindAll(s => s.Param == "water").Count + ", ";
      res += "\"ph\":" + unplaced.FindAll(s => s.Param == "ph").Count + ", ";
      res += "\"humidity\":" + unplaced.FindAll(s => s.Param == "humidity").Count + ", ";
      res += "\"fertilizer\":" + unplaced.FindAll(s => s.Param == "fertilizer").Count + ", ";
      res += "\"light\":" + unplaced.FindAll(s => s.Param == "light").Count;

      res += "}";
      return res;
    }

    public string GetPlacedSensors() {
      string res = "\"placed\":[";
      bool first = true;
      for (int i = 0; i < length; i++)
      {
        for (int j = 0; j < width; j++)
        {
          Sensor s = SensorsField[j, i];
          if (s != null)
          {
            if (!first) res += ", ";
            first = false;
            res += "{\"ID\":" + s.ID + ", \"x\":" + j + ", \"y\":" + i + ", \"type\":\"" + s.Param + "\"}";
          }
        }
      }
      res += "]";

      return res;
    }


    public string GetUnplacedDevices()
    {
      string res = "\"unplaced\":{";

      List<Device> unplaced = devices.FindAll(d => !d.Placed);
      res += "\"conditioner\":" + unplaced.FindAll(d => d.Type == "conditioner").Count + ", ";
      res += "\"heater\":" + unplaced.FindAll(d => d.Type == "heater").Count + ", ";
      res += "\"lighter\":" + unplaced.FindAll(d => d.Type == "lighter").Count + ", ";
      res += "\"humidifier\":" + unplaced.FindAll(d => d.Type == "humidifier").Count + ", ";
      res += "\"fertilizer\":" + unplaced.FindAll(d => d.Type == "fertilizer").Count;

      res += "}";
      return res;
    }

    public string GetPlacedDevices()
    {
      string res = "\"placed\":[";
      bool first = true;
      for (int i = 0; i < length; i++)
      {
        for (int j = 0; j < width; j++)
        {
          Device d = DevicesField[j, i];
          if (d != null)
          {
            if (!first) res += ", ";
            first = false;
            res += "{\"ID\":" + d.ID + ", \"x\":" + j + ", \"y\":" + i + ", \"type\":\"" + d.Type + "\"}";
          }
        }
      }
      res += "]";

      return res;
    }

    public string GetCurrentParams(string type) {
      string res = "{\"cells\":[";
      for (int i = 0; i < width; i++)
        for (int j = 0; j < length; j++) {
          if (i + j != 0)
            res += ", ";
          res += "{\"val\":" + ParametersField[i, j].ToDict().GetValueOrDefault(type) + ", \"x\":" + i + ", \"y\":"+ j + "}";
        }
      res += "]}";
      return res;
    }
  } 
}
