using System;

namespace Greenhouse.Models.Equipment
{
  public class Device
  {
    
    static int last_id = 0;

    private int _id;
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
      set => placed = value;
    }

    public string Type {
      get => type;
      set => type = value;
    }
  }
}
