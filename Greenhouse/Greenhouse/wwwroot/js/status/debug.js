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
createTable(10, 8, table);
table.addClass('equipment-table');
table.addClass('table-responsive');


var div = $('<div class="col-md-6">');
$(div).append(table);
#$('#page-container').children().first().prepend(div);


function getParam(type) {
  $.get( "/Status/GetParameters", "type=" + type, function( data ) {
    data = $.parseJSON(data);
    data = data.cells;

    for (var i = 0, len = data.length; i < len; i++) {
      var p = data[i];  
      drawParam(p.val, p.x, p.y);
    }
  });
  getDevices();
  sleep(200);

  setTimeout(function(){getParam(type);}, 200);
}

function drawParam(val, x, y) {
  var cell = $('tr').eq(y).children().eq(x);
  val = Number(val).toFixed(2);

  if(!cell.hasClass('device'))
    cell.html('<span>' + val + '</span>');
  //cell.css({"padding-top": "5%", "background-color": "rgba(0, 50, 255, " + (1 - (val - 18)/6) + ")"});

  var r, b, a;
  if (val < 22) {
    r = 0; b = 255;
  } else if (val == 22) {
    r = 255; b = 255;
  } else {
    r = 255; b = 0;
  }
  a = (abs(val - 22)/6);

  cell.css({"padding-top": "5%", "background-color": "rgba(" + r + ", 50, " + b + ", " + a + ")"});
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
    //setTimeout(getSensors, 5000);
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