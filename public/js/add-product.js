$(document).ready(function(){
    $('#add-product-btn').click(() => {
        $('#add-product-popup').fadeIn(500);
        $('.black-modal').fadeIn(500);
    })
    $('.black-modal').click(() => {
        $('#add-product-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
    })
    $('.close-popup').click(() => {
        $('#add-product-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
    })
    

});