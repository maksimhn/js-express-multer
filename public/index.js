'use strict';

$(function(){
  $('#upload').on('click', function(){
    var formData = new FormData($('#upload-form')[0]);
    $.ajax({
      // url: 'http://httpbin.org/post',
      url: 'http://localhost:3000/images',
      type: 'POST',
      contentType: false,
      processData: false,
      data: formData
    })
    .done(function(data){
      $('#result').html(JSON.stringify(data, null, 2));
    })
    .fail(function(jqxhr){
      console.error(jqxhr);
    });
  });
});
