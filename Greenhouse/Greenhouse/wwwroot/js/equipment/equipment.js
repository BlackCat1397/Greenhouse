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
$('#page-container').children().first().prepend(div);






function placeSensor(type) {
  

  $('td').off('click');
  $('tbody').off('click', '.sensor', deleteSensor);
  $('tbody').off('click', 'span.oi', deleteDevice);

  $('td').on('click', function(e) {   //обработчик кликов для каждой ячейки
    var x = $(this).index();          //($this) – ячейка, на которую кликнули, .index() – её номер
    var y = $(this).parent().index()  //.parent() – то, в чем она лежит

    $.post("/Equipment/PlaceSensor", 'x='+ x + '&y=' + y + '&type=' + type, function(sensor){  //$.post – послать на сервер
      if(sensor == "fail") {
        alert('Something goes wrong! Try again.');
        return false;
      }
      sensor = $.parseJSON(sensor);
      drawSensor(sensor.type, sensor.x, sensor.y);
      var q =  $('#' + sensor.type + '-unplaced').text();
      $('#' + sensor.type + '-unplaced').text(q-1);
      $('tbody').on('click', '.sensor', deleteSensor);
      $('tbody').on('click', 'span.oi', deleteDevice);
    });

    $('td').off('click');
  });
}



function deleteSensor(e) {
  if(!confirm('Delete sensor?')) {
    return false;
  }

  var x = $(this).index();          //($this) – ячейка, на которую кликнули, .index() – её номер
  var y = $(this).parent().index()  //.parent() – то, в чем она лежит
  var cell = $(this);

  $.ajax({
    url: '/Equipment/UnplaceSensor/',
    data: 'x=' + x + '&y=' + y,
    type: 'DELETE',
    success: function(resp) {
          
          var q =  $('#' + resp + '-unplaced').text();
          $('#' + resp + '-unplaced').text(parseInt(q)+1);
          cell.css('background-color', "");
          cell.removeClass("sensor");
    },
    error: function(){alert('Something goes wrong! Try again.');}
  });
}

function drawSensor(type, x, y) {
  var color = [["air", "#ddf"], ["humidity", "#add8e6"], ["fert", "brown"], ["light", "#fff04e"], ["water", "blue"], ["ph", "green"]];
  color = new Map(color);

  var cell = $('tr').eq(y).children().eq(x);
  cell.css('background-color', color.get(type));
  cell.addClass('sensor');
}

function getSensors() {
  $.get( "/Equipment/GetSensors", function( data ) {
    data = $.parseJSON(data);
    var placed = data.placed;
    var unplaced = data.unplaced;
    for(type in unplaced) {
      $('#' + type + "-unplaced").text(unplaced[type]);
    }
    for (var i = 0, len = placed.length; i < len; i++) {
      var p = placed[i];
      drawSensor(p.type, p.x, p.y);
    }
    //setTimeout(getSensors, 5000);
  });
}



function placeDevice(type) {
  //alert("Add " + type);
  $('td').off('click');
  $('tbody').off('click', '.sensor', deleteSensor);
  $('tbody').off('click', 'span.oi', deleteDevice);

  $('td').on('click', function(e) {   //обработчик кликов для каждой ячейки
    var x = $(this).index();          //($this) – ячейка, на которую кликнули, .index() – её номер
    var y = $(this).parent().index()  //.parent() – то, в чем она лежит

    $.post("/Equipment/PlaceDevice", 'x='+ x + '&y=' + y + '&type=' + type, function(device){  //$.post – послать на сервер
      if(device == "fail") {
        alert('Something goes wrong! Try again.');
        return false;
      }
      device = $.parseJSON(device);

      drawDevice(type, x, y);
      var q =  $('#' + device.type + '-unplaced').text();
      $('#' + device.type + '-unplaced').text(q-1);
      $('tbody').on('click', '.sensor', deleteSensor);
      $('tbody').on('click', 'span.oi', deleteDevice);
    });

    $('td').off('click');
  });
}

function deleteDevice(e) {
  if(!confirm('Delete device?')) {
    return false;
  }

  var x = $(this).parent().index();          //($this) – ячейка, на которую кликнули, .index() – её номер
  var y = $(this).parent().parent().index()  //.parent() – то, в чем она лежит
  var cell = $(this).parent();

  $.ajax({
    url: '/Equipment/UnplaceDevice/',
    data: 'x=' + x + '&y=' + y,
    type: 'DELETE',
    success: function(resp) {
          
          var q =  $('#' + resp + '-unplaced').text();
          $('#' + resp + '-unplaced').text(parseInt(q)+1);
          cell.html("");
          cell.removeClass("device");
    },
    error: function(){alert('Something goes wrong! Try again.');}
  });
}


function drawDevice(type, x, y) {
  var icon = [["lighter", "sun"], ["conditioner", "cloud"], ["heater", "fire"], ["fertilizer", "beaker"], ["humidifier", "droplet"]];
  icon = new Map(icon);
  var cell = $('tr').eq(y).children().eq(x);
  cell.html('<span class="oi oi-' + icon.get(type) +  '"></span>');
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
      drawDevice(p.type, p.x, p.y);
    }
    //setTimeout(getSensors, 5000);
  });
}



$(document).ready(function() {
  getSensors();
  getDevices();
});

$('#add-sensor-air').on('click', function(e) {
  placeSensor('air');
});
$('#add-sensor-water').on('click', function(e) {
  placeSensor('water');
});
$('#add-sensor-ph').on('click', function(e) {
  placeSensor('ph');
});
$('#add-sensor-humidity').on('click', function(e) {
  placeSensor('humidity');
});
$('#add-sensor-fert').on('click', function(e) {
  placeSensor('fert');
});
$('#add-sensor-light').on('click', function(e) {
  placeSensor('light');
});


$('#add-lighter').on('click', function(e) {
  placeDevice('lighter');
});
$('#add-conditioner').on('click', function(e) {
  placeDevice('conditioner');
});
$('#add-heater').on('click', function(e) {
  placeDevice('heater');
});
$('#add-fertilizer').on('click', function(e) {
  placeDevice('fertilizer');
});
$('#add-humidifier').on('click', function(e) {
  placeDevice('humidifier');
});


$('tbody').on('click', '.sensor', deleteSensor);
$('tbody').on('click', 'span.oi', deleteDevice);

