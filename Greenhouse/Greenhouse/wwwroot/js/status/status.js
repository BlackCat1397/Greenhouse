function createTable(width, height, table) {
  table.id("field");
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
var fieldTemplate;
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
      drawParam(p.val, p.x, p.y);
    }
  });
}

function drawParam(val, x, y) {
  var cell = $('tr').eq(y).children().eq(x);
  val = Number(val).toFixed(2);
  cell.css("background-color", "rgba(0, 50, 255, " + 0.6 + (val - 18)/4 + ")");
  cell.html('<span>' + val + '</span>');
  cell.css({"padding-top": "5%", "background-color": "rgba(0, 0, 255, " + (1 - (val - 18)/6) + ")"});
}

function drawSensor(type, x, y, id) {
  var color = [["air", "#ddf"], ["humidity", "#add8e6"], ["fert", "brown"], ["light", "#fff04e"], ["water", "blue"], ["ph", "green"]];
  color = new Map(color);

  var cell = $('tr').eq(y).children().eq(x);
  cell.find(".sensor-id").text(id);
  cell.css('background-color', color.get(type));
  cell.addClass('sensor');
}

function buildSensorsTable(sensors) {
  var table = $('#table-sensors');
  var new_table = table.clone();
  var tbody = new_table.find('tbody');
  tbody.html("");
  $.get( "/Plans/CurrentPeriod", function(data) {
    data = $.parseJSON(data);

    sensors.forEach(function (s) {
      var tr = $('<tr>');
      var target = data[s.type];

      tr.append('<td>' + s.type + '</td><td>' + target + '</td><td>' + s.ID + '</td>');
      var td = $('<td>' + Number(s.value).toFixed(1) + '</td>');
      if(abs(Number(s.value).toFixed(1)-target) <= 0.5)
        td.addClass('alert alert-success');
      else
        if(abs(Number(s.value).toFixed(1)-target) <= 1)
          td.addClass('alert alert-warning');
        else  
          td.addClass('alert alert-danger');
      tr.append(td);
      tbody.append(tr);
    });
    table.replaceWith(new_table);
  });


}

function getSensors() {
  $.get( "/Equipment/GetSensors", function( data ) {
    data = $.parseJSON(data);
    var placed = data.placed;
    for (var i = 0, len = placed.length; i < len; i++) {
      var p = placed[i];
      drawSensor(p.type, p.x, p.y, p.ID);
    }
    buildSensorsTable(placed);
  });
}

function buildDevicesTable(devices) {
  var table = $('#table-devices');
  var new_table = table.clone();
  var tbody = new_table.find('tbody');
  tbody.html("");

  devices.forEach(function (d) {
    var tr = $('<tr>');
    tr.append('<td>' + d.type + '</td><td>' + d.ID + '</td>');
    tr.append('<td class="alert alert-' + (d.state == "On" ? "success" : "danger") + '">' + d.state + '</td>');
    tbody.append(tr);
  });

  table.replaceWith(new_table);
}

function drawDevice(type, x, y, id) {
  var icon = [["lighter", "sun"], ["conditioner", "cloud"], ["heater", "fire"], ["fertilizer", "beaker"], ["humidifier", "droplet"]];
  icon = new Map(icon);
  var cell = $()('tr').eq(y).children().eq(x);
  cell.find('.device-id').text(id);
  var h = cell.html();
  cell.html(h + '<span class="oi oi-' + icon.get(type) +  '">');
  cell.css("padding-top", "0");
}

function getDevices() {
  $.get( "/Equipment/GetDevices", function( data ) {
    data = $.parseJSON(data);
    var placed = data.placed;
    var unplaced = data.unplaced;
    for(type in unplaced) {
      $('#' + type + "-unplaced").text(unplaced[type]);
    }
    for (var i = 0, len = placed.length; i < len; i++) {
      var p = placed[i];
      drawDevice(p.type, p.x, p.y, p.ID);
    }
    buildDevicesTable(placed);
  });
}

function clear() {
  for(i = 0; i < 10; i++) {
    for(j = 0; j < 8; j++) {
      var cell = $('tr').eq(j).children().eq(i);
      cell.html("<span class='sensor-id'></span><span class='device-id'></span>");
      cell.css('background-color', '');
    }
  }
}

clearFieldTemplate() {
  for(i = 0; i < 10; i++) {
    for(j = 0; j < 8; j++) {
      var cell = fieldTemplate.find('tr').eq(j).children().eq(i);
      cell.html("<span class='sensor-id'></span><span class='device-id'></span>");
      cell.css('background-color', '');
    }
  }
}

function upd() {
  getSensors();
  getDevices();
  clearFieldTemplate();
  setTimeout(upd, 200);
}

function abs(a) {
  return a >= 0 ? a : -a;
}

$(document).ready(function() {
  clear();
  fieldTemplate = field.clone();
  upd();
});