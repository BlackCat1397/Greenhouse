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
      _waterTemperature = 23;
      _ph = 5.6;
      _humidity = 92;
      _lightening = 80;
      _fertilization = 90;
    }

    public Parameters(double AirTemperature, double WaterTemperature, double PH, double Humidity, double Lightening, double Fertilization) {
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
      set => _airTemperature = value;
    }

    [JsonProperty(PropertyName = "Water temperature")]
    public double WaterTemperature
    {
      get => _waterTemperature;
      set => _waterTemperature = value;
    }

    public double PH
    {
      get => _ph;
      set => _ph = value;
    }

    public double Humidity
    {
      get => _humidity;
      set => _humidity = value;
    }

    public double Lighting
    {
      get => _lightening;
      set => _lightening = value;
    }

    public double Fertilization
    {
      get => _fertilization;
      set => _fertilization = value;
    }
  }
}
