$(document).ready(function(){
    $('#tab1-btn').click(() => {
        $('#tab1').show();
        $('#tab2').hide();
        $('#tab3').hide();
        $('#tab4').hide();
        $('#tab1-btn').addClass('active');
        $('#tab2-btn').removeClass('active');
        $('#tab3-btn').removeClass('active');
        $('#tab4-btn').removeClass('active');
    });
    $('#tab2-btn').click(() => {
        $('#tab1').hide();
        $('#tab2').show();
        $('#tab3').hide();
        $('#tab4').hide();
        $('#tab1-btn').removeClass('active');
        $('#tab2-btn').addClass('active');
        $('#tab3-btn').removeClass('active');
        $('#tab4-btn').removeClass('active');
    });
    $('#tab3-btn').click(() => {
        $('#tab1').hide();
        $('#tab2').hide();
        $('#tab3').show();
        $('#tab4').hide();
        $('#tab1-btn').removeClass('active');
        $('#tab2-btn').removeClass('active');
        $('#tab3-btn').addClass('active');
        $('#tab4-btn').removeClass('active');
    });
    $('#tab4-btn').click(() => {
        $('#tab1').hide();
        $('#tab2').hide();
        $('#tab3').hide();
        $('#tab4').show();
        $('#tab1-btn').removeClass('active');
        $('#tab2-btn').removeClass('active');
        $('#tab3-btn').removeClass('active');
        $('#tab4-btn').addClass('active');
    });

    $('#add-image-button').click(() => {
        $('#add-image-popup').fadeIn(500);
        $('.black-modal').fadeIn(500);
    })
    $('#edit-btn').click(() => {
        $('#edit-product-popup').fadeIn(500);
        $('.black-modal').fadeIn(500);
    })
    $('.black-modal').click(() => {
        $('#edit-product-popup').fadeOut(500);
        $('#add-image-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
    })
    $('.close-popup').click(() => {
        $('#edit-product-popup').fadeOut(500);
        $('#add-image-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
    })
    
    
    $('#star1').mouseenter(() => {
        $('#star1').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star2').removeClass('active').removeClass('fa-star').addClass('fa-star-o');
        $('#star3').removeClass('active').removeClass('fa-star').addClass('fa-star-o');
        $('#star4').removeClass('active').removeClass('fa-star').addClass('fa-star-o');
        $('#star5').removeClass('active').removeClass('fa-star').addClass('fa-star-o');
    });
    $('#star2').mouseenter(() => {
        $('#star1').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star2').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star3').removeClass('active').removeClass('fa-star').addClass('fa-star-o');
        $('#star4').removeClass('active').removeClass('fa-star').addClass('fa-star-o');
        $('#star5').removeClass('active').removeClass('fa-star').addClass('fa-star-o');
    });
    $('#star3').mouseenter(() => {
        $('#star1').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star2').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star3').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star4').removeClass('active').removeClass('fa-star').addClass('fa-star-o');
        $('#star5').removeClass('active').removeClass('fa-star').addClass('fa-star-o');
    });
    $('#star4').mouseenter(() => {
        $('#star1').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star2').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star3').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star4').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star5').removeClass('active').removeClass('fa-star').addClass('fa-star-o');
    });
    $('#star5').mouseenter(() => {
        $('#star1').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star2').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star3').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star4').addClass('active').addClass('fa-star').removeClass('fa-star-o');
        $('#star5').addClass('active').addClass('fa-star').removeClass('fa-star-o');
    });

    var numberOfImages = parseInt(document.getElementById('images-length').textContent);
    console.log(numberOfImages);
    var images = [];
    for(var i=0; i<numberOfImages; i++)
        images.push({btn: $(`#img-btn${i}`), cover: $(`#cover${i}`), })
    
    var clearAll = (images) => {
        for (let i = 0; i < images.length; i++) 
            images[i].cover.hide();
        $('#cover').hide();
    }
    
    images.forEach(image => {
        image.btn.click(() => {
            clearAll(images);
            image.cover.show();
        })
    });
    for (let i = 0; i < images.length; i++) 
        images[i].cover.hide();


});