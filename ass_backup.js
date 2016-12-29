const fs = require('fs');
var mnemonic = require('./mnemonic.js');

fs.readFile('code.txt', 'utf8', function(err, data) {
    if (err) {
        console.log(err);
    }
    var datasplit = data.split('\t');
    var datasplit2 = [];
    var datasplit3 = data.split('\n');
    for (var i = 0; i < datasplit.length; i++) {
        datasplit2.push(datasplit[i].split('\n'));
    }
    var myNewArray = [].concat.apply([], datasplit2);
    // console.log(datasplit3);
    // fs.writeFile('localca.txt', datasplit, function(err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log('success');
    // })
    // console.log(myNewArray);
    local(myNewArray, datasplit3, function(allpush) {
        objectcode(allpush, mnemonic,function(objectcodefin){
            obcodetofile(objectcodefin);
        });
    });
});

function local(data, datasplit3, callback) {
    var inputFS = [];
    var local = [];
    var length = data.length;
    var lengthsplit = datasplit3.length;
    var a = 0;
    var localFirst;
    var otherlocal;
    var other2;
    for (var i = 0; i < length; i++) {
        if (data[i] == "FIRST") {
            // local.push(parseInt(data[2]));
            localFirst = parseInt(data[2], 16);
            otherlocal = localFirst;
            other2 = localFirst;
            // console.log(otherlocal);
            break;
        }
    }

    for (var i = 0; i < length; i++) {
        if (data[i] == "BYTE") {
            var findByte = data[i + 1].split("'")
            for (var j = 0; j < 3; j++) {
                if (findByte[j] == "C") {
                    // console.log(otherlocal.toString(16)+" before");
                    // otherlocal -= 3;
                    // var apush = otherlocal + findByte[j + 1].length;
                    otherlocal += findByte[j + 1].length;
                    // local.push(other2.toString(16) + " BYTEC");
                    local.push(other2.toString(16));
                    other2 = otherlocal;
                    // console.log(other2.toString(16) + ' afterBYTEC');
                    // console.log(findByte[j + 1].length);
                }
                if (findByte[j] == "X") {
                    // otherlocal -= 3;
                    // var apush = otherlocal + findByte[j + 1].length / 2;
                    otherlocal += findByte[j + 1].length / 2;
                    // local.push(other2.toString(16) + " BYTEX");
                    local.push(other2.toString(16));
                    other2 = otherlocal;
                }
            }
        } else if (data[i] == "RESW") {
            // otherlocal -= 3;
            // var apush = other2 + 3 * parseInt(data[i + 1]);
            otherlocal += 3 * parseInt(data[i + 1]);
            // local.push(other2.toString(16) + " RESW");
            local.push(other2.toString(16));
            other2 = otherlocal;
        } else if (data[i] == "RESB") {
            // console.log(other2.toString(16) + "RESBbe");
            // var apush = otherlocal + parseInt(data[i + 1]);
            otherlocal += parseInt(data[i + 1]);
            // console.log(other2.toString(16) + "RESBaf");
            local.push(other2.toString(16)); //string > number > hexstring >number
            // local.push(other2.toString(16) + " RESB"); 
            other2 = otherlocal;
        } else if (data[i] == "END" || data[i] == "WORD" || data[i] == "STL" || data[i] == "RSUB" || data[i] == "JSUB" || data[i] == "STA" || data[i] == "LDA" || data[i] == "COMP" || data[i] == "JEQ" || data[i] == "J" || data[i] == "LDL" || data[i] == "LDX" || data[i] == "TD" || data[i] == "JEQ" || data[i] == "RD" || data[i] == "STCH" || data[i] == "TIX" || data[i] == "JLT" || data[i] == "STX" || data[i] == "LDCH" || data[i] == "WD" || data[i] == "JLT") {
            otherlocal += 3;
            // local.push(other2.toString(16) + " " + data[i]);
            local.push(other2.toString(16));
            other2 = otherlocal;
            // console.log(otherlocal.toString(16) + " " + data[i]);
        }
    }
    var aaaa = 0;
    var allpush = [];
    for (var z = 0; z < lengthsplit; z++) {
        if (z == 0) {
            allpush.push('\t\t' + datasplit3[z] + '\n');
        } else if (z == 1) {
            var a = datasplit3[z].split('\n');
            a.splice(0, 0, local[aaaa] + '\t');
            allpush.push(a[0] + a[1] + '\n');
            aaaa++;
        } else if (datasplit3[z] != "." && z < lengthsplit) {
            // console.log(datasplit3[z+1].split('\n'));
            var a = datasplit3[z].split('\n');
            a.splice(0, 0, local[aaaa] + '\t');
            // console.log(datasplit3[z + 1]);
            allpush.push(a[0] + a[1] + '\n');
            aaaa++;
        } else if (z < lengthsplit) {
            allpush.push(datasplit3[z] + '\n');

        }
    }
    var allpush2 = [].concat.apply([], allpush);
    // console.log(allpush2);
    callback(allpush2.join(''));

    // fs.writeFile('localca.txt', allpush2.join(''), function(err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log('success');
    // });

}

function objectcode(allpush, mnemonic,callback) {
    var split = allpush.split('\n'),
        split2 = [],
        split3 = [];
    objectcodefin = [];
    for (var i = 0; i < split.length; i++) {
        split2.push(split[i].split('\t'));

        if (isNaN(split2[i][1]) != false && typeof split2[i][1] != 'undefined') {
            split3.push(split2[i][0]);
            split3.push(split2[i][1]);
        }
    }
    for (var i = 0; i < split.length; i++) {
        if (split2[i][2] != '' && typeof split2[i][2] != 'undefined') {
            // console.log(split2[i][2] + ' ' + split2[i][split2[i].length - 1]);

            if (split2[i][2] == 'WORD') {
                var wordcode = parseInt(split2[i][split2[i].length - 1]).toString(16);
                if (wordcode.length == 1) {
                    objectcodefin.push('00000' + wordcode);

                } else if (wordcode.length == 2) {
                    objectcodefin.push('0000' + wordcode);

                } else if (wordcode.length == 3) {
                    objectcodefin.push('000' + wordcode);

                } else if (wordcode.length == 4) {
                    objectcodefin.push('00' + wordcode);

                }
                // console.log(wordcode.length);
            } else if (split2[i][2] == 'RESB' || split2[i][2] == 'RESW') {
                objectcodefin.push(' ');
            } else if (split2[i][2] == 'BYTE') {
                var bytesplit = split2[i][3].split("'");
                if (bytesplit[0] == 'X') {
                    objectcodefin.push(bytesplit[1]);
                } else {
                    var asciicode = '';
                    for (var j = 0; j < bytesplit2[1].length; j++) {
                        // console.log(asciicode);
                        asciicode += parseInt(bytesplit2[1].charCodeAt(j)).toString(16);
                    }
                    objectcodefin.push(asciicode);
                }
                // objectcodefin.push();
            } else if (split2[i][2] == 'RSUB') {
                objectcodefin.push('4C0000');
            } else if (split2[i][2] == 'END') {

                objectcodefin.push(' ');
            } else {
                for (var j = 0; j < mnemonic.length; j++) {
                    if (split2[i][2] == mnemonic[j]) {
                        var testa;
                        // console.log(split2[i][2] + mnemonic[j + 1]);
                        testa = mnemonic[j + 1];
                        for (var z = 0; z < split3.length; z++) {
                            if (split2[i][split2[i].length - 1] == split3[z]) {
                                // console.log(split2[i][split2[i].length - 1] + ' ' + split3[z - 1]);
                                // testa += split3[z-1];
                                objectcodefin.push(testa + split3[z - 1]);
                                // console.log(split2[i]);
                            }
                        }
                        if (split2[i][split2[i].length - 1] == 'BUFFER,X') {
                            // console.log(split2[i]);
                            for (var z = 0; z < split3.length; z++) {
                                if (split3[z] == 'BUFFER') {
                                    var buffercode = parseInt(split3[z - 1]) + 8000;
                                    objectcodefin.push(testb + buffercode);
                                }
                            }
                        }
                    }
                }

            }

        } else if (split2[i][2] == '' && typeof split2[i][2] != 'undefined') {
            // var testc;
            // var testd;
            // console.log(split2[i][3] + ' ' + split2[i][split2[i].length - 1]);

            if (split2[i][3] == 'WORD') {
                var wordcode2 = parseInt(split2[i][split2[i].length - 1]).toString(16);
                if (wordcode2.length == 1) {
                    objectcodefin.push('00000' + wordcode2);

                } else if (wordcode2.length == 2) {
                    objectcodefin.push('0000' + wordcode2);

                } else if (wordcode2.length == 3) {
                    objectcodefin.push('000' + wordcode2);

                } else if (wordcode2.length == 4) {
                    objectcodefin.push('00' + wordcode2);

                }
                // console.log(wordcode2);
            } else if (split2[i][3] == 'RESB' || split2[i][2] == 'RESW') {
                objectcodefin.push(' ');
            } else if (split2[i][3] == 'BYTE') {
                var bytesplit2 = split2[i][4].split("'");
                if (bytesplit2[0] == 'X') {
                    objectcodefin.push(bytesplit2[1]);
                } else {
                    var asciicode = '';
                    for (var j = 0; j < bytesplit2[1].length; j++) {
                        // console.log(asciicode);
                        asciicode += parseInt(bytesplit2[1].charCodeAt(j)).toString(16);
                    }
                    objectcodefin.push(asciicode);
                }
                // objectcodefin.push();
            } else if (split2[i][3] == 'RSUB') {
                objectcodefin.push('4C0000');
            } else if (split2[i][3] == 'END') {
                objectcodefin.push(' ');
            } else {
                for (var j = 0; j < mnemonic.length; j++) {
                    if (split2[i][3] == mnemonic[j]) {
                        // console.log(split2[i][3] + mnemonic[j + 1]);
                        var testb;
                        testb = mnemonic[j + 1];
                        // console.log(testb);
                        for (var z = 0; z < split3.length; z++) {
                            if (split2[i][split2[i].length - 1] == split3[z]) {
                                // console.log(split2[i][split2[i].length - 1] + ' ' + split3[z - 1]);
                                // testb += split3[z-1];
                                objectcodefin.push(testb + split3[z - 1]);
                                // console.log(testb + split3[z - 1]);
                            }
                        }
                        if (split2[i][split2[i].length - 1] == 'BUFFER,X') {
                            // console.log(split2[i]);
                            for (var z = 0; z < split3.length; z++) {
                                if (split3[z] == 'BUFFER') {
                                    var buffercode = parseInt(split3[z - 1]) + 8000;
                                    objectcodefin.push(testb + buffercode);
                                }
                            }
                        }
                    }
                }
            }

        }

    }
    // console.log(objectcodefin);
    callback(objectcodefin);
}


function obcodetofile (objectcodefin){
    console.log('jeee');
}