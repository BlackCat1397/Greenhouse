function deletePeriod(e) {
  var tr = e.target.parentNode.parentNode;
  var name = tr.children[0];
  name = (name.textContent?name.textContent:name.innerText);

  var t = confirm("You are going to delete period " + name + "!");
  if(t) {
    var period_id = e.target.getAttribute('data-period-id');
    var plan_id = tr.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-plan-id');
    $.post('/Plans/DeletePeriod?plan_id=' + 0 + '&period_id=' + period_id, function(data, textStatus, jqXHR){
      alert(data);
      tr.parentNode.removeChild(tr);
    }).fail(function(){alert('Something goes wrong! Try again.')});
  }
}


function setupSlip(list) {
  var flag_dragging = false;
  list.addEventListener('mouseover', function(e){
    document.onselectstart = function(){ return false; }
  });
  list.addEventListener('mouseout', function(e){
    if(!flag_dragging){
      document.onselectstart = function(){ return true; }
    }
  });

  list.addEventListener('slip:beforereorder', function(e){
      flag_dragging = true;
      if (e.target.classList.contains('demo-no-reorder')) {
          flag_dragging = false;
          e.preventDefault();
      }
  }, false);

  list.addEventListener('slip:beforewait', function(e){
      var f = "ontouchstart" in document.documentElement;
      if(e.target.getAttribute('data-action') == 'del-period') {
          deletePeriod(e);
      }
      else
        if(e.target.getAttribute('data-action') == 'edit-period')
      if (!f) e.preventDefault();
  }, false);

  list.addEventListener('slip:beforeswipe', function(e){
      if (e.target.nodeName == 'INPUT' || e.target.parentNode.classList.contains('demo-no-swipe')) {
          e.preventDefault();
      }
  }, false);

  list.addEventListener('slip:reorder', function(e){
      flag_dragging = false;
      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
      return false;
  }, false);
  return new Slip(list);
}

setupSlip(document.getElementById('demo1'));
setupSlip(document.getElementById('plan2'));

document.getElementById('del-plan-1').addEventListener('click', function(e){
  if(confirm("OH SHHHH, U're going to delete Uour plan!!! Permanently!!! NaSoVsEm!!11!!!")) {
    e.target.parentNode.parentNode.style.display ='none';
  }
});
document.getElementById('del-plan-2').addEventListener('click', function(e){
  if(confirm("OH SHHHH, U're going to delete Uour plan!!! Permanently!!! NaSoVsEm!!11!!!")) {
    e.target.parentNode.parentNode.style.display ='none';
  }
});

function addPlan(data) {
  var plan = jQuery.parseJSON( data );

  var res = document.createElement("div");
  res.classList.add('plan');
  var innerHTML = '<h2><input type="text" class="plan-name" value="' + plan.ID + '. ' + plan.Name + '">' +
  ' <span class="oi oi-pencil oi--plan" title="pencil" aria-hidden="true"></span>' + 
  ' <span class="oi oi-trash oi--plan" title="trash" aria-hidden="true" id="del-plan-' + plan.ID + '"></span>' +
  '</h2>' +
  '<div class="row">' +
  '<div class="col-xl-9">' +
      '<table class="table table-responsive table-striped plan">' +
        '<thead>' +
          '<tr>' +
            '<th scope="col">Parameters</th>' +
            '<th scope="col">Duration (hours):</th>';

            var params = plan.Periods[0].Params;
            params = Object.keys( params );
              
            for (i = 0; i < params.length; i++) {
              innerHTML += "<th scope='col'>" + params[i] + ":</th>";
            }

        innerHTML += '<th colspan="2"></th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="demo1">' +


        '</tbody>' +
      '</table>' +
      '<div class="btn-add-period">' +
        '<button type="button" class="btn btn-success" style="width: 100%">Add period</button>' +
      '</div>' +
    '</div>' +
    '<div class="col-xl-3"><img class="img-fluid img-plan" src="/img/Charts/chart1.png"></div>' +
  '</div>' +
'</div>';

  res.innerHTML = innerHTML;
  var container = document.getElementById('page-container');
  container.insertBefore(res, container.children[1]);

  return res;
}

document.getElementById('add-plan').addEventListener('click', function(e){
  $.post('/Plans/Create', function(data, textStatus, jqXHR){
    alert('data' + data);
    alert(addPlan(data));
  }).fail(function(){alert('Something goes wrong! Try again.')});
});



//add period fct
function addPeriodToPage(data, plan_id) {
  data = $.parseJSON(data);
  var params = data.Params;
  params = Object.values( params );

  var tr = document.createElement("tr");
  tr.classList.add('draggable');
  tr.classList.add('demo-no-swipe');

  var innerHTML = '<th scope="row">' + data.Name + '</th>' +
                            '<td>' + data.Duration + '</td>';

  for(i = 0; i < params.length; i++)
    innerHTML += '<td>' + params[i] + '</td>';

  innerHTML += '<td><span class="oi oi-pencil" title="pencil" aria-hidden="true" data-action="edit-period" data-period-id="data.ID"></span></td>' +
              '<td><span class="oi oi-trash" title="trash" aria-hidden="true" data-action="del-period" data-period-id="data.ID"></span></td>';

  tr.innerHTML = innerHTML;
  document.getElementById('plan-' + plan_id).children[1].children[0].children[0].children[1].appendChild(tr);
} 

var addPeriod = function() {
  var plan_id = this.getAttribute("plan-id");

  $.post('/Plans/AddPeriod?id=' + plan_id, function(data, textStatus, jqXHR){
    addPeriodToPage(data, plan_id);
  }).fail(function(){alert('Something goes wrong! Try again.')});
};

var add_per_btn = document.getElementsByClassName("add-per-btn");
for (var i = 0; i < add_per_btn.length; i++) {
    add_per_btn[i].addEventListener('click', addPeriod, false);
}