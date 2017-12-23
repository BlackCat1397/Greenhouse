using System;
using System.Collections.Generic;

namespace Greenhouse.Models.Log
{
  public class Event
  {
    public TimeSpan time;
    public string type;
    public string data;
    public bool seen;
  }

  public class Log
  {
    private List<Event> events;

    public Log()
    {
      events = new List<Event>();
    }

    public string EventToJson(Event e)
    {
      string res = "{";
      res += "\"time\":\"" + e.time.ToString() + "\"";
      res += ", \"type\":\"" + e.type + "\"";
      res += ", \"data\":\"" + e.data + "\"";

      res += "}";
      return res;
    }

    public bool AddEvent(TimeSpan time, string type) {
      Event e = new Event();
      e.time = time;
      e.type = type;
      e.seen = false;

      events.Add(e);
      return true;
    }

    public bool AddEvent(TimeSpan time, string type, string data)
    {
      Event e = new Event();
      e.time = time;
      e.type = type;
      e.data = data;
      e.seen = false;

      events.Add(e);
      return true;
    }

    public string ToJson() {
      string res = "{\"events\":[";
      int last = events.Count - 1;
      for (int i = last; i > 0; i--) {
        res += EventToJson(events[i]) + ", ";
      }
      if(last >= 0)
        res += EventToJson(events[0]);

      res += "]}";
      return res;
    }

    public string UnseenToJson()
    {
      List<Event> unseen = events.FindAll(x => x.seen == false);
      string res = "{\"events\":[";
      int last = unseen.Count - 1;
      for (int i = last; i > 0; i--)
      {
        res += EventToJson(unseen[i]) + ", ";
      }
      if (last >= 0)
        res += EventToJson(unseen[0]);

      res += "]}";
      return res;
    }

    public void MarkSeen()
    {
      events.ForEach(x => x.seen = true);
      //for (int i = 0; i < unseen.Count; i++) {
      //  Event e = new Event();
      //  e.data = unseen[i].data;
      //  e.seen = true;
      //  e.time = unseen[i].time;
      //  e.type = unseen[i].type;

      //  unseen[i] = e;
      //}; 
    }
  }
}
