function createTable(width, height, table) {
  tbody = table.append('<tbody>');

  for(i = 0; i < height; i++) {
    var tr = $(document.createElement('tr'));
    for(j = 0; j < width; j++) {
      tr.append('<td></td>');
    }
    tbody.append(tr);
  }
}

var table = $(document.createElement('table'));
var curFunction;

createTable(10, 8, table);
table.addClass('equipment-table');
table.addClass('table-responsive');


var div = $('<div class="col-md-6">');
$(div).append(table);

$('#page-container').children().first().prepend(div);
$('#page-container').children().first().prepend($('<div class="col-md-3">'));

function getParam(type) {
  $.get( "/Status/GetParameters", "type=" + type, function( data ) {
    data = $.parseJSON(data);
    data = data.cells;

    for (var i = 0, len = data.length; i < len; i++) {
      var p = data[i];  
      drawParam(p.val, p.x, p.y, type);
    }
  });
  getDevices();

  curFunction = setTimeout(function(){getParam(type);}, 1000);
}

function drawParam(val, x, y, type) {
  var cell = $('tr').eq(y).children().eq(x);
  val = Number(val).toFixed(2);

  if(!cell.hasClass('device'))
    cell.html('<span>' + val + '</span>');
  //cell.css({"padding-top": "5%", "background-color": "rgba(0, 50, 255, " + (1 - (val - 18)/6) + ")"});

  var r, g, b, a;
  console.log(type);

  if(type == "Air temperature" || type == "Water temperature")
  {
    var middle = type=="Air temperature"?22:20;

    g = 50;
    if (val < middle) {
      r = 0; b = 255;
    } else if (val == middle) {
      r = 255; b = 255;
    } else {
      r = 255; b = 0;
    }
    a = (abs(val - middle)/6);
  }
  else if (type == "Lighting") {
    r = (155/100)*val + 100;
    r = Number(r).toFixed(0);
    g = r;

    b = 0;
    a = 1;
  }
  else if (type == "Fertilizer")
  {
    r = 131; g = 42; b = 34;
    a = val/100;
  }
  else if (type == "Humidity")
  {
    r = 65; g = 180; b = 255;
    a = val/100;
  }
  else if (type == "PH")
  {
    var middle = 7;

    r = 0; g = 0; b = 0;
    if (val < middle) {
      r = 255; g = 128;
    } else if (val == middle) {
      r = 255; b = 255;
    } else {
      r = 127; b = 255;
    }
    a = (abs(val - middle)/7);
  }

  cell.css({"padding-top": "5%", "background-color": "rgba(" + r + ", "+ g +", " + b + ", " + a + ")"});
}

$(document).ready(function() {
  getParam("Air temperature");
});


function getDevices() {
  $.get( "/Equipment/GetDevices", function( data ) {
    data = $.parseJSON(data);
    var placed = data.placed;
    var unplaced = data.unplaced;

    $("td.device").html("");
    $("td.device").removeClass("device");

    for(type in unplaced) {
      $('#' + type + "-unplaced").text(unplaced[type]);
    }
    for (var i = 0, len = placed.length; i < len; i++) {
      var p = placed[i];
      drawDevice(p.type, p.x, p.y);
    }
  });
}

function drawDevice(type, x, y) {
  var icon = [["lighter", "sun"], ["conditioner", "cloud"], ["heater", "fire"], ["fertilizer", "beaker"], ["humidifier", "droplet"]];
  icon = new Map(icon);
  var cell = $('tr').eq(y).children().eq(x);

  cell.html('<span class="oi oi-' + icon.get(type) +  '"></span>');
  cell.css("padding-top", "0");

  cell.addClass("device");
  //cell.addClass("oi-" + icon.get(type));
  //cell.css("padding-top", "0");
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function abs(a) {
  return a >= 0 ? a : -a;
}

$('#btn-air').click(function() {
  clearTimeout(curFunction);
  getParam("Air temperature");
});

$('#btn-water').click(function() {
  clearTimeout(curFunction);
  getParam("Water temperature");
});

$('#btn-ph').click(function() {
  clearTimeout(curFunction);
  getParam("PH");
});

$('#btn-fert').click(function() {
  clearTimeout(curFunction);
  getParam("Fertilizer");
});

$('#btn-humidity').click(function() {
  clearTimeout(curFunction);
  getParam("Humidity");
});

$('#btn-light').click(function() {
  clearTimeout(curFunction);
  getParam("Lighting");
});