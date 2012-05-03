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
    $('#calendar li').removeClass('current')
    // Add the correct current class
    $(this).parent().addClass('current')
    var month = $(this).attr('id')
  })
});