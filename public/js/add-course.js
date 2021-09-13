$(document).ready(function(){
    $('#add-course-btn').click(() => {
        $('#add-course-popup').fadeIn(500);
        $('.black-modal').fadeIn(500);
    })
    $('.black-modal').click(() => {
        $('#add-course-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
    })
    $('.close-popup').click(() => {
        $('#add-course-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
    })
    

});