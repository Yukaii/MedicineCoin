var medicineGroupIds = [];
var user_ids;
user_names = [];
(function($, window, document) {
    $(function() {
        $('#add_btn').click(addMedicineGroup);
        $('#delete_btn').click(function() {
            $('.medicine-group:last-child').remove();
        })

        $('#eat_time').select2();

        $('#user-lists');
        $('#user-lists').click(function() {
            $(this).val(user_ids[1]);    
        });


        $('#user-lists').change(function() {
          $('.mainColPhoto').html('<img src="img/dollar.png"></img>');
          
          s = '<div class="span4">' +
            '<div class="mainCol">Name：10 dollar</div>' + 
            '<div class="mainCol">Birthday：secret</div>' +
            '<div class="mainCol">Gender：BOY</div>' +
          '</div>' +
          '<div class="span3">' + 
            '<div class="mainCol">BloodType：AC/DC</div>' + 
            '<div class="mainCol">Weight：99</div>' +
            '<div class="mainCol">Height：190</div>' +
          '</div>';

          $('.row').html(s);
          fakePres();


        });

        $('#user-lists option').each(function(index) {
            $(this).attr({value: user_ids[index]})
        });

        
        $('#submit_prescription').click(submitPrescription);

        for (var i = 1; i <= 60; i++) {
            $('#time_span').append($("<option></option>").attr({value: i}).text(i));
        }
        $('#time_span').select2().val("3");    
        // $('#user-lists').val(user_ids[1]);    
   });  
    $.getJSON('https://medicinelookup.firebaseio.com/users.json?shallow=true',function (data) {
            user_ids = Object.keys(data);

            for (var i in user_ids) {
                user_url = "https://medicinelookup.firebaseio.com/users/" + i + "/name.json"
                console.log(i);
                $.getJSON(user_url, function (data) {
                    user_names.push(data)
                    var s = '<option value="'+ i + '">' + data + '</option>';
                    $('#user-lists').append(s);        
                });
            }
            setInterval(function() {
                $('#user-lists option').each(
                    function(index) {
                        $(this).attr({value: user_ids[index]
            })})}, 3000);       
    });


}(window.jQuery, window, document));

// $(document).ready(function() {


function fakePres () {
  pres_string = '<div class="mainBlock">'+
    '<div class="mainCol">Choose Prescription：'+
      '<ul>'+
        '<li><a><span class="fake-link">2014/08/20</a></span></li>'+
        '<li><a><span class="fake-link">2014/05/12</a></span></li>'+
        '<li><a><span class="fake-link">2014/03/25</a></span></li>'+
        '<li><a><span class="fake-link">2014/03/17</a></span></li>'+
        '<li><a><span class="fake-link">2014/02/12</a></span></li>'+
        '<li><a><span class="fake-link">2014/01/05</a></span></li>'+
      '</ul>'+
    '</div>'+
  '</div>'
  $($('.pa').get(0)).html(pres_string);
  $('.fake-link').click(fakeMed);
}

function fakeMed() {
  
  s = '<div class="mainBlock">'+
      '<div class="mainCol">Medicines：'+
        '<ul>'+
          '<li>腸納格懸液/DONNAGEL SUSPENSION</li>'+
          '<li>恩體能膠囊/ANTINAL CAPSUES</li>'+
          '<li>每鞭達挫/MEBENDAZOLE</li>'+
        '</ul>'+
      '</div>'+
      '<div class="mainCol">Eat Time：飯後</div>'+
      '<div class="mainCol">Morning：吃！</div>'+
      '<div class="mainCol">Noon：吃！</div>'+
      '<div class="mainCol">Night：吃！</div>'+
      '<div class="mainCol">Date：2014/05/12</div>'+
    '</div>';
  $($('.pa').get(1)).html(s);
}
    

    

// });

function resetForm () {
    $('.medicine-group').remove();
    $('input[type="checkbox"]').each(function(index) {$(this).attr("checked", false)});
    $('#time_span').val("3");
}

function submitPrescription () {
    prescription = {};

    medicinesIds = [];
    $('.medicine-list :selected').map(function(o) {medicinesIds.push($(this).get(0).value)});
    prescription["medicines"] = medicinesIds;

    user_id = $('#user-lists :selected').get(0).value

    count = $(".medicine-group").length;
    
    var eat_time = {};
    $('input[type="checkbox"]').map(function(i) {eat_time[$(this).get(0).name] =  $(this).get(0).checked});

    $.extend(prescription, eat_time);
    
    d = new Date();
    prescription["date"] = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate();

    prescription[""]

    // console.log(prescription);
    $.getJSON("https://medicinelookup.firebaseio.com/users/" + user_id + "/prescriptions.json?shallow=true", function (data) {
        // prescriptionLength = Object.keys(data).length;
        postData = {};
        // postData[prescriptionLength] = prescription;
        postUrl = "https://medicinelookup.firebaseio.com/users/" + user_id + "/prescriptions/.json";
        $.ajax({
          type: "POST",
          url: postUrl,
          data: JSON.stringify(prescription),
          success: function() {console.log("success!")},
          dataType: 'json'
        });    
    });

}

function addAddButton (medicineListId) {
    $("#"+medicineListId).insertAfter($("<button></button>")
        .attr("class", "add-btn")
        .click(addMedicineGroup)
        .text("+"));
}

function addMedicineGroup () {
    count = $(".medicine-group").length;
    medicineGroupId = "medicine-group" + (count + 1);
    medicineListId = "medicine-list" + (count + 1);

    // console.log("medicineGroupId" + medicineGroupId + "\n, " + "medicineListId" + medicineListId);

    console.log(count+1);
    $("#medicine-lists").append($("<div/>", {id: medicineGroupId, class: "medicine-group"}));


    addMedicineList(medicineGroupId, count);

    // addAddButton("s2id_" + medicineListId);
}


function appendMedicineOption( medicineListId ) {
    // console.log("append medicine" + medicineListId);
    for (var i = 0; i < medicine_names.length; i++) {
        $("#"+medicineListId).append($("<option></option>")
            .attr("value", medicine_codes[i])
            .text(medicine_names[i]));   
    }    
}

function addMedicineList ( medicineGroupId, listCount ) {

    var medicineListId = "medicine-list" + (listCount + 1);

    // console.log(medicineListId);
    beforeOrAfter = '<div><input type="checkbox" name="eatBefore" value="true">飯前</input>' + '<input type="checkbox" name="eatAfter" value="true">飯後</input></div>';
    eatTime = '<div><input type="checkbox" name="morning" value="true">早</input><input type="checkbox" name="noon" value="true">午</input><input type="checkbox" name="night" value="true">晚</input></div>'

    $("#"+medicineGroupId).append(
        $("<select/>", {id: medicineListId, class: "medicine-list"}));
    
    appendMedicineOption(medicineListId);
    
    $("#"+medicineListId).select2();
    // medicineListIds.push(newListId);   
}

