/* Author:

*/
jQuery(document).ready(function($) {  
  // Slide open the calendar
  $('#picker').click(function(){
    $(this).parent().toggleClass('open')
    $('#calendar').slideToggle(200)
  })
  
  // Click a calendar month
  $('#month a').click(function(e){
    // Remove any current classes
    $('#calendar a').removeClass('current')
    // Add the correct current class
    $(this).addClass('current')
    var month = $(this).attr('id')
    
    $("#day a").each(function(day){
      // Hide or show day appropriately
      if ($(this).hasClass("no"+month))
        $(this).hide(75)
      else
        $(this).show(75)
      // Cjamge tje IR:
      var day = $(this).attr('href').substr(4)
      $(this).attr('href','/'+month+day)
      
    })
  })
});