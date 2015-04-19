
sendForm = function(){
  event.preventDefault

  dataHash = {
    '{name}' : $('#name').val(),
    '{email}' : $('#email').val(),
    '{phone}' : $('#phone').val(),
    '{message}' : $('#message').val()
      }

  $.ajax({
    url: 'http://pooleapp.com/stash/347cefc5-78dc-4d85-b789-6f40e4a8e296/',
    method: 'POST',
    dataType: 'json',
    data: dataHash
  }).always(function(){
    console.log('done')
    $('#success').html("<div class='alert alert-success'>");
    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
        .append("</button>");
    $('#success > .alert-success')
        .append("<strong>Thank you "+ $('#name').val()+", your message has been sent. I will get back to you as soon as possible!</strong>");
    $('#success > .alert-success')
        .append('</div>');
    $('form')[0].reset()
  })
}


$(function(){
  $('form').on('submit', function(event){
    event.preventDefault()
    sendForm()
  })
})