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


function getTemp() {
  $.get( "/Status/GetParameters", function( data ) {
    data = $.parseJSON(data);
    data = data.cells;

    for (var i = 0, len = data.length; i < len; i++) {
      var p = data[i];  
      drawParam(p.val, p.x, p.y);
    }
    setTimeout(getTemp, 1000);
  });
}

function drawParam(val, x, y) {
  var cell = $('tr').eq(y).children().eq(x);
  cell.html('<span>' + val + '</span>');
  cell.css("padding-top", "5%");
}

$(document).onLoad(getTemp);
