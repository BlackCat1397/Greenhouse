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
