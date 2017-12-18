using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using System.Diagnostics;

using Greenhouse.Models.Plan;
using Greenhouse.System;

namespace Greenhouse
{
  public class Program
  {
    public static GreenhouseSystem ghs;

    public static void Main(string[] args)
    {
      ghs = new GreenhouseSystem();
      ghs.Configure();
      ghs.Start();

      BuildWebHost(args).Run();
    }

    public static IWebHost BuildWebHost(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
               .UseContentRoot(Directory.GetCurrentDirectory())
               .UseStartup<Startup>()
               .UseUrls("http://*:5000")
               .Build();
  }
}
