using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Greenhouse.Models.Plan
{
  public class Parameters
  {
    private double _airTemperature;
    private double _waterTemperature;
    private double _ph;
    private double _humidity;
    private double _lightening;
    private double _fertilization;


    public Parameters()
    {
      _airTemperature = 22;
      _waterTemperature = 20;
      _ph = 5.6;
      _humidity = 92;
      _lightening = 80;
      _fertilization = 90;
    }

    public Parameters(Parameters ToCopy)
    {
      this._airTemperature = ToCopy.AirTemperature;
      this._waterTemperature = ToCopy.WaterTemperature;
      this._ph = ToCopy.PH;
      this._humidity = ToCopy.Humidity;
      this._lightening = ToCopy.Lighting;
      this._fertilization = ToCopy.Fertilization;
    }

    public Parameters(double AirTemperature, double WaterTemperature, double PH, double Humidity, double Lightening, double Fertilization) {
      this.AirTemperature = AirTemperature;
      this.WaterTemperature = WaterTemperature;
      this.PH = PH;
      this.Humidity = Humidity;
      this.Lighting = Lightening;
      this.Fertilization = Fertilization;
    }

    public void SetParameters(double AirTemperature, double WaterTemperature, double PH, double Humidity, double Lightening, double Fertilization)
    {
      this.AirTemperature = AirTemperature;
      this.WaterTemperature = WaterTemperature;
      this.PH = PH;
      this.Humidity = Humidity;
      this.Lighting = Lightening;
      this.Fertilization = Fertilization;
    }

    public Dictionary<string, double> ToDict()
    {
      Dictionary<string, double> dict = new Dictionary<string, double>();
      dict.Add("Air temperature", _airTemperature);
      dict.Add("Water temperature", _waterTemperature);
      dict.Add("PH", _ph);
      dict.Add("Humidity", _humidity);
      dict.Add("Lighting", _lightening);
      dict.Add("Fertilizer", _fertilization);

      return dict;
    }

    [JsonProperty(PropertyName = "Air temperature")]
    public double AirTemperature {
      get => _airTemperature;
      set
      {
        double min = 17, max = 30;
        if (value > max)
          value = max;
        else if (value < min)
          value = min;

        _airTemperature = value;
      }
    }

    [JsonProperty(PropertyName = "Water temperature")]
    public double WaterTemperature
    {
      get => _waterTemperature;
      set
      {
        double min = 15, max = 28;
        if (value > max)
          value = max;
        else if (value < min)
          value = min;

        _waterTemperature = value;
      }
    }

    public double PH
    {
      get => _ph;
      set
      {
        if (value > 14)
          value = 14;
        else if (value < 0)
          value = 0;

        _ph = value;
      }
    }

    public double Humidity
    {
      get => _humidity;
      set 
      { 
        if (value > 100)
          value = 100;
        else if (value < 0)
          value = 0;
        
        _humidity = value;
      }
    }

    public double Lighting
    {
      get => _lightening;
      set
      {
        if (value > 100)
          value = 100;
        else if (value < 0)
          value = 0;

        _lightening = value;
      }
    }

    public double Fertilization
    {
      get => _fertilization;
      set
      {
        if (value > 100)
          value = 100;
        else if (value < 0)
          value = 0;

        _fertilization = value;
      }
    }

    public string ToJson (){
      string res = "{";
      res += "\"air\":" + AirTemperature;
      res += ", \"water\":" + WaterTemperature;
      res += ", \"fert\":" + Fertilization;
      res += ", \"ph\":" + PH;
      res += ", \"light\":" + Lighting;
      res += ", \"humidity\":" + Humidity;
      res += "}";
      return res;
    }
  }
}
