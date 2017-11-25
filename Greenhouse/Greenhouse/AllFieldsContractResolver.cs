using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

using Newtonsoft;
using Newtonsoft.Json.Serialization;

namespace Greenhouse
{
  public class AllFieldsContractResolver : Newtonsoft.Json.Serialization.DefaultContractResolver
  {
    protected override IList<Newtonsoft.Json.Serialization.JsonProperty> 
                                       CreateProperties(Type type, Newtonsoft.Json.MemberSerialization memberSerialization)
    {
      var props = type
          .GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
          .Select(p => base.CreateProperty(p, memberSerialization))
          .Union(type.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
          .Select(f => base.CreateProperty(f, memberSerialization)))
          .ToList();
      props.ForEach(p => { p.Writable = true; p.Readable = true; });
      return props;
    }
  }
}
