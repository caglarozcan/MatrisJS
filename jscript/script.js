var adet = 0;
var topMatris = 0;
$(document).ready(function(){
    $('button[name=olustur_btn]').click(function(){
        var satir = $('input[name=satir]').val();
        var sutun = $('input[name=sutun]').val();
        adet = parseInt($('input[name=mt_adet]').val());
        topMatris += adet;
        var ornekveri = $('input[name=ornek]').is(':checked');
        
        if(hesapYapildimi){
            $('.matris').html('');
        }

        var html = '';

        for(var k = 1; k<=adet; k++){
            html += '<div id="mt_' + k + '" class="matris_container">';
            html += '<ul class="mt_data">';

            for(var i=0; i<satir; i++){
                html += '<li>';
                for(var j=0; j<sutun; j++){
                    html += '<input type="text" class="form-control mt_cell" value="' + ornekVeriOlustur(ornekveri) + '"/>';
                }
                html += '</li>';
            }
            html += '</ul>';
            html += '</div>';
        }

        $('.matris').append(html);
    });
});

var bigMatris = new Array();
var matris = new Array();
var temp = new Array();
var sonuc = new Array();
var isaret = '+';
var hesapYapildimi = false;

function ornekVeriOlustur(durum){
    if(durum){
        return Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    }else{
        return '';
    }
}

function hesapla(){

    bigMatris = new Array();
    matris = new Array();
    temp = new Array();
    sonuc = new Array();
    hesapYapildimi = true;

    var skip = 0;

    $('.mt_data').each(function(){
        if(skip >= topMatris){
            $(this).remove();
        }
        skip++;
    });

    var islem = $('input[type=radio]:checked').val();

    $('.matris').find('ul').each(function(){
        $(this).find('li').each(function(){
            $(this).find('input[type=text]').each(function(){
                temp.push(parseInt($(this).val()));
            });
            matris.push(temp);
            temp = [];
        });
        bigMatris.push(matris);
        matris = [];
    });

    switch(islem){
        case 't':
            isaret = '+';
            toplamaIslemi();
            yazdir();
            break;
        case 'c':
            isaret = '-';
            cikarmaIslemi();
            yazdir();
            break;
        case 'det':
            determinantIslemi();
            //yazdir();
            break;
        case 'tp':
            transpozIslemi();
            yazdir();
            break;
        case 'cp':
            isaret = '*';
            carpmaIslemi();
            yazdir();
            break;
        default:
            console.log('böyle bir işlem yok');
            break;
    }
}

function yazdir(){

    $('.esittir').remove();

    var html = '<div class="esittir">=</div><ul class="mt_data">';
    for(var i=0; i<sonuc.length; i++){
        html += '<li>';
        for(j=0;j<sonuc[0].length; j++){
            html += '<input type="text" class="form-control mt_cell" value="' + sonuc[i][j] + '" readonly/>';
        }
        html += '</li>';
    }
    html += '</ul>';
    $('.matris .matris_container:not(:last-child)').after('<div class="esittir">' + isaret + '</div>');
    $('.matris').append(html);
}

function toplamaIslemi(){
    var toplam = 0;

    for(var j=0; j<bigMatris[0].length; j++){
        for(var k=0; k<bigMatris[0][0].length; k++){
            for(var i=0; i<bigMatris.length; i++){
                toplam += bigMatris[i][j][k];
            }
            temp.push(toplam);
            toplam = 0;
        }
        sonuc.push(temp);
        temp = [];
    }
}

function cikarmaIslemi(){

    for(var i=1; i<bigMatris.length; i++){
        for(var j=0; j<bigMatris[0].length; j++){
            for(var k=0; k<bigMatris[0][0].length; k++){
                bigMatris[i][j][k] *= -1;
            }
        }
    }

    var toplam = 0;

    for(var j=0; j<bigMatris[0].length; j++){
        for(var k=0; k<bigMatris[0][0].length; k++){
            for(var i=0; i<bigMatris.length; i++){
                toplam += bigMatris[i][j][k];
            }
            temp.push(toplam);
            toplam = 0;
        }
        sonuc.push(temp);
        temp = [];
    }
}

function determinantIslemi(){
    if(bigMatris.length != 1){
        alert('Determinant almak için tek bir matris eklenmiş olmalı.');
        return false;
    }else if(bigMatris[0].length > 3 || bigMatris[0][0] > 3){
        alert("Sadece 2x2 ve 3x3 boyutlu matrislerin determinantı hesaplanabilir.");
        return false;
    }

    var det = (bigMatris[0][0][0] * bigMatris[0][1][1]) - (bigMatris[0][0][1] * bigMatris[0][1][0]);
    var text = '(' + bigMatris[0][0][0] + ' x ' + bigMatris[0][1][1] + ') - ('+bigMatris[0][0][1] + ' x ' + bigMatris[0][1][0] + ') = ';
    html = '<div class="esittir">=></div><div class="esittir">' + text + det + '</div>';
    $('.matris').append(html);
}

function transpozIslemi(){
    sonuc = Object.keys(bigMatris[0][0]).map(function (c) {
        return bigMatris[0].map(function (r) {
            return r[c];
        });
    });
}

function carpmaIslemi(){

    if(bigMatris[0][0].length != bigMatris[1].length){
        alert('Birinci matrisin satır sayısı ikinci matrisin sütun sayısına eşit olmalı.');
        return false;
    }

    for(var m = 0; m < (bigMatris.length-1); m++){
        for(var i = 0; i < bigMatris[m].length; i++){
            var temp = new Array();
            for(var j = 0; j < bigMatris[m][0].length; j++){
                var carpim = 0;
                for(var k = 0; k < bigMatris[m+1][0].length; k++){
                    carpim = carpim + (bigMatris[m][i][k] * bigMatris[m+1][k][j]);
                    
                }
                temp.push(carpim);
            }
            sonuc.push(temp);
        }

        if(bigMatris.length > 0){
            bigMatris[m+1] = sonuc;
            sonuc = new Array();
        }
    }

    sonuc = bigMatris[bigMatris.length-1];
}