
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
    $('form').reset()
  })
}


$(function(){
  $('form').on('submit', function(event){
    event.preventDefault()
    sendForm()
  })
})