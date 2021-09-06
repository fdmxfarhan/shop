$(document).ready(function(){
    var
        persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
        arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
        fixNumbers = function (str)
        {
        if(typeof str === 'string')
        {
            for(var i=0; i<10; i++)
            {
            str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }
        return str;
        };
    $(":input").bind('keyup change click', function (e) {
            this.value = fixNumbers(this.value);
        });
})