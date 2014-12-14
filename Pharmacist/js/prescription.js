var prescriptions = {};
var medicines = [];
var BASE_URL = "https://medicinelookup.firebaseio.com/"
(function($, window, document) {
  


  $.getJSON('https://medicinelookup.firebaseio.com/users/1/prescriptions.json', function(data) {
    prescriptions = data;
    loadMedicineDatas();
    setInterval(appendPrescription, 2000);

  }); 

  $(function() {
    console.log(prescriptions);  
  }); 
  
}(window.jQuery, window, document));


function loadMedicineDatas () {
  // var prescriptionLength = prescriptions.length;
    for (var index in prescriptions) {
      meds = prescriptions[index]["medicines"];
      for (var i in meds) {
        $.getJSON("https://medicinelookup.firebaseio.com/medicines/" + meds[i]+ ".json", function(data) {
          medicines.push(data);
          // d = {};
          // d[meds[i]] = data;
          // console.log(data + ", " + meds[i]);
          // $.extend(medicines, d);
          // medicines[meds[i]] = data;
        });
      }
      
    }
    // setInterval(appendPrescription(), 2000);
}

function appendPrescription () {
  swap = medicines;
  medicines = {};
  for (var i in swap) {
    medicines[swap[i]["許可證字號"]] = swap[i];
  }
  // pres_keys = Object.keys(prescriptions);
  
  for (var key in prescriptions) {
    pres = prescriptions[key]
    s = '<ul>'

    if (pres["eatBefore"])
      s += "飯前";
    else
      s += "飯後";

    s += '</ul><ul>'

    if (pres["morning"])
      s += "早";
    if (pres["noon"])
      s += "中";
    if (pres["night"])
      s += "晚";
    s += "服用</ul>";

    $('.pres-wrapper').append(s);
  }


  // $('.pres-wrapper').append(JSON.stringify(prescriptions));
}