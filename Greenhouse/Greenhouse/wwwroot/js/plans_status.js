//INPUT functions

function resizeInput(e) {
  if (e.which !== 0 && e.charCode !== 0) { // only characters
    var c = String.fromCharCode(e.keyCode|e.charCode);
    $span = $(this).siblings('span').first();
    $span.text($(this).val() + c); // the hidden span takes 
                                    // the value of the input
    var $inputSize = $span.width() + 6; 
    $(this).css("width", $inputSize); // apply width of the span to the input
  }
}

function activateInput() {
  var plan_id = $(this).data('plan-id');
  var input = $(this).siblings('input');
  var prev_name = input.val();
  input.prop('disabled', false);
  input.focus();
  input.siblings('.oi').fadeOut(200);

  input.on("keypress.enter", function(e) {
    if(e.keyCode == 13) {
      renamePlan(plan_id, $(this).val(), prev_name, $(this));
    }
  });

  input.on("focusout", function() {
    renamePlan(plan_id, $(this).val(), prev_name, $(this));
  });
}

function deactivateInput(input) {
  input.off("keypress.enter");
  input.off("focusout");
  input.prop('disabled', true);
  input.siblings('.oi').fadeIn(200);
  input.focusout();
}


//PLAN functions

function addPlan(data) {
  var plan = jQuery.parseJSON( data );

  var res = $('#plan-sample').clone();
  res.insertAfter('h1');
  res.attr('id', 'plan-' + plan.ID);

  var input = res.find('h2').find('input.plan-name');
  input.val(plan.ID + '. ' + plan.Name);
  var span = input.siblings('span').first();
  span.text(plan.ID + '. ' + plan.Name);

  res.find('.oi--plan').data('plan-id', plan.ID);
  res.find('.add-per-btn').data('plan-id', plan.ID);

  var tbody = res.find('tbody');
  tbody.attr('id', 'tbody-' + plan.ID);
  var periods = plan.Periods;
  if(periods.length == 0)
  {
    tbody.empty();
  }
  else 
  {
    for(i = 1; i < periods.length; i++) {
      var p = res.find('tbody').find('tr').first().clone();
      tbody.append(p);
    }

    for(i = 0; i < periods.length; i++) {
      var cells = tbody.find('tr').eq(i).children();
      var per = periods[i];

      cells.find('.oi-bolt').data('plan-id', plan.ID);
      cells.find('.oi-pencil').data('plan-id', plan.ID);
      cells.find('.oi-trash').data('plan-id', plan.ID);
      cells.find('.oi').data('period-id', per.ID);


      cells.eq(0).text(per.Name);
      cells.eq(1).text(per.Duration);

      var params = Object.values(per.Params);
      for(j = 2; j < 2 + params.length; j++) {
        cells.eq(j).text(params[j-2]);
      }
    }
  }


  res.find('#timeline-template').attr('id', 'timeline-' + plan.ID);

  res.show();
  drawChart(plan.ID);
  setupSlip(tbody[0]);
  
  var inputSize = span.width() + 6;
  input.css("width", inputSize); // apply width of the span to the input


  input.keypress(resizeInput);

  return res;
}


function activatePlan() {
  var id = $(this).data('plan-id');
  if(confirm("You are going to activate plan " + id + ". This will deactivate current plan. Are you sure?")) {
    $.post('/Plans/ActivatePlan/' + id, function(data, textStatus, jqXHR){
    }).fail(function(){alert('Something goes wrong! Try again.');});
  }
}

function deletePlan() {
  var id = $(this).data('plan-id');
  if(confirm("Are you really want to permanently delete plan?")) {
    $.ajax({
      url: '/Plans/Delete/' + id,
      type: 'DELETE',
      success: function(plan_id) {
            $('#plan-'+plan_id).remove();
        },
      error: function(){alert('Something goes wrong! Try again.');}
    });
  }
}

function renamePlan(plan_id, name, prev_name, input) {
  deactivateInput(input);
  $.post('/Plans/Rename?id=' + plan_id + '&new_name=' + name, function(data, textStatus, jqXHR){
  }).fail(function(){
    alert('Something goes wrong! Try again.');
    $("#plan-" + plan_id).find('input.plan-name').val(prev_name);

    $span = input.siblings('span').first();
    $span.text(prev_name);
    var $inputSize = $span.width() + 6; 
    input.css("width", $inputSize);
  });
}



//PERIOD functions

function addPeriod() {
  var plan_id = $(this).data("plan-id");

  $.post('/Plans/AddPeriod?id=' + plan_id, function(data, textStatus, jqXHR){
    addPeriodToPage(data, plan_id);
    drawChart(plan_id);
  }).fail(function(){alert('Something goes wrong! Try again.')});
};

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

  innerHTML += '<td><span class="oi oi-pencil" title="pencil" aria-hidden="true" data-action="edit-period" data-plan-id="" data-period-id=""></span></td>' +
              '<td><span class="oi oi-trash" title="trash" aria-hidden="true" data-action="del-period" data-plan-id="" data-period-id=""></span></td>';

  tr.innerHTML = innerHTML;
  $(tr).find('.oi').data('period-id', data.ID);
  $(tr).find('.oi').data('plan-id', plan_id);
  document.getElementById('plan-' + plan_id).children[1].children[0].children[0].children[1].appendChild(tr);
}


function replacePeriod(data, period_id) {
  per = $.parseJSON(data);

  //var cells = $("span").filter("[data-period-id='" + period_id + "']").first().parent().parent().children();
  var cells = $("span").filter(function() { 
    return $(this).data("period-id") == period_id; 
  }).first().parent().parent().children();
  cells.eq(0).text(per.Name);
  cells.eq(1).text(per.Duration);

  var params = Object.values(per.Params);
  for(j = 2; j < 2 + params.length; j++) {
    cells.eq(j).text(params[j-2]);
  }
}  

function editPeriod(e) {
  var tr = e.target.parentNode.parentNode;
  var name = tr.children[0];  name = (name.textContent?name.textContent:name.innerText);
  var period_id = $(e.target).data('period-id');
  var plan_id = $(e.target).data('plan-id');

  $('#periodModalLabel').text('Edit ' + name + ' period');
  $('#periodModal').data('period-id', period_id);
  $('#periodModal').data('plan-id', plan_id);
  $('#periodModal').modal();
}

function deletePeriod(e) {
  var tr = e.target.parentNode.parentNode;
  var name = tr.children[0];
  name = (name.textContent?name.textContent:name.innerText);

  var t = confirm("You are going to delete period " + name + "!");
  if(t) {
    var period_id = $(e.target).data('period-id');
    var plan_id = $(e.target).data('plan-id');
    $.post('/Plans/DeletePeriod?plan_id=' + plan_id + '&period_id=' + period_id, function(data, textStatus, jqXHR){
      tr.parentNode.removeChild(tr);
      drawChart(plan_id);
    }).fail(function(){alert('Something goes wrong! Try again.')});
  }
}



$('#add-plan').on('click', function(e){
  $.post('/Plans/Create', function(data, textStatus, jqXHR){
    addPlan(data);
  }).fail(function(){alert('Something goes wrong! Try again.')});
});
$("#page-container").on("click", ".oi-trash.oi--plan", deletePlan);
$("#page-container").on("click", ".oi-pencil.oi--plan", activateInput);
$("#page-container").on("click", ".oi-bolt.oi--plan", activatePlan);
$("#page-container").on("click", ".add-per-btn", addPeriod);
$('input[type="text"]').keypress(resizeInput);

var e = jQuery.Event("keypress");
e.which = ' '; // # Some key code value
$('input').trigger(e);



//SLIP
var tables = $("[id^='tbody']");
tables.each(function(th) {
  setupSlip(this);
});

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
      console.log('a');
      if (e.target.classList.contains('demo-no-reorder') || e.target.classList.contains("oi")) {
          flag_dragging = false;
          e.preventDefault();
      }
  }, false);

  list.addEventListener('slip:beforewait', function(e){
      if(e.target.getAttribute('data-action') == 'del-period') {
          deletePeriod(e);
      }
      else {
        if(e.target.getAttribute('data-action') == 'edit-period') {
          editPeriod(e);
        }
      }
      var f = "ontouchstart" in document.documentElement;
      if (!f) e.preventDefault();
  }, false);

  list.addEventListener('slip:beforeswipe', function(e){
      if (e.target.nodeName == 'INPUT' || e.target.parentNode.classList.contains('demo-no-swipe')) {
          e.preventDefault();
      }
  }, false);

  list.addEventListener('slip:reorder', function(e){
      var plan_id = $(e.target).find(".oi-pencil").data('plan-id');
      var period_id = $(e.target).find(".oi-pencil").data('period-id');
      $.post('/Plans/MovePeriod', "plan_id=" + plan_id + "&period_id=" + period_id 
                  + "&index=" + e.detail.spliceIndex + "&prev_index=" + e.detail.originalIndex)
                      .fail(function(){
                        alert('FATAL ERRORS OCCURED! RELOAD PAGE IMMEDIATTELY!')
                      });
      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
      drawChart(plan_id);
      flag_dragging = false;
      return false;
  }, false);
  return new Slip(list);
}

$('#edit-period-form').on('submit', function(e) {
  e.preventDefault();

  var form_data = $('#edit-period-form').serialize();
  var period_id = $('#periodModal').data('period-id');
  var plan_id = $('#periodModal').data('plan-id');
  form_data += "&period_id=" + period_id;
  form_data += "&plan_id=" + plan_id;

  $.post('/Plans/EditPeriod', form_data).done(function(data){
    replacePeriod(data, period_id);
    drawChart(plan_id);
    $('#periodModal').modal('hide');
  }).fail(function() {alert('Something goes wrong! Try again.')});
});