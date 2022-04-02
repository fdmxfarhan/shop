$(document).ready(function(){
    var scroll1 = document.getElementById('horisontal-scroll1');
    var scroll2 = document.getElementById('horisontal-scroll2');
    $('#next-btn1').click(() => {
        scroll1.scrollLeft -= 600;
    });
    $('#prev-btn1').click(() => {
        scroll1.scrollLeft += 600;
    });
    $('#next-btn2').click(() => {
        scroll2.scrollLeft -= 600;
    });
    $('#prev-btn2').click(() => {
        scroll2.scrollLeft += 600;
    });
    
});