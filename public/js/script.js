/* Author:

*/
jQuery(document).ready(function($) {
  $('#picker').click(function(){
    $(this).parent().toggleClass('open')
    $('#calendar').slideToggle(200)
  })
});
