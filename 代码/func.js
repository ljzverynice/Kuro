
function SHA256(s){
    var chrsz = 8;
    var hexcase = 0;
    function safe_add (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
    }
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
    function core_sha256 (m, l) {
    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;
    for ( var i = 0; i<m.length; i+=16 ) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];
    for ( var j = 0; j<64; j++) {
        if (j < 16) W[j] = m[j + i];
        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));
        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]);
    HASH[1] = safe_add(b, HASH[1]);
    HASH[2] = safe_add(c, HASH[2]);
    HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]);
    HASH[5] = safe_add(f, HASH[5]);
    HASH[6] = safe_add(g, HASH[6]);
    HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
    }
    function str2binb (str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
    }
    return bin;
    }
    function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
        utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
    }
    function binb2hex (binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
        hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);
    }
    return str;
    }
    s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}
function turnTo(newpage){
    if(arguments[1]){
        let skey=arguments[1];
        window.location.href=(`${newpage}.htm?skey=${skey}`);
    }
    else{
    let skey = window.location.href.split("=")[1];
    window.location.href=(`${newpage}.htm?skey=${skey}`);
    }
}
function checkStatus(response){
    if (response.status >= 200 && response.status < 300) {
    return response;} 
    else {
    throw err;
    }
}
function getPoem(){
    let poem=document.querySelector(".sentence");
    let from=document.querySelector('.from');
    fetch('http://39.97.228.101:8080/kuro/motto').then(res => res.json()).then(function(response){
        let obj=eval(response);
        let content=obj.data.content;
        let author=obj.data.author;
        content=content.replace(/\n/g,"<br/>");
        poem.innerHTML=content;
        from.innerHTML=`--${author}`;
    });
}
function regist(){
    let phonenum=document.querySelector("input[name=phonenum]").value;
    let nickname=document.querySelector("input[name=nickname]").value;
    let password1=document.querySelector("input[name=password1]").value;
    let password2=document.querySelector("input[name=password2]").value;
    let tip1=document.querySelector(".tip1");
    let phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if(phonenum.length==11){
        phonenum=Number(phonenum);
        if(phonenum&&phonenum%1===0){
            if(phoneReg.test(phonenum)){
                if(password1==password2&&password2.length>=6){
                    password1=SHA256(password1);
                    let data={"id":phonenum,"password":`${password1}`,"nick":`${nickname}`};
                    fetch("http://39.97.228.101:8080/kuro/user",{
                    method: "POST",
                    body: JSON.stringify(data),
                    }).then(checkStatus).then(res => res.json()).then(function (response){
                    turnTo("login");}).catch(function(err){
                        tip1.innerHTML="该手机号已被注册！";tip1.style.color='black';
                    })
                }
                else{
                    if(password1!=password2){
                    tip1.innerHTML="前后密码不一致,请重新输入！";tip1.style.color='black';}
                    else{
                    tip1.innerHTML="密码不能小于6位,请重新输入！";tip1.style.color='black';
                    }
                }
            }
            else{tip1.innerHTML="请输入合法的手机号！";tip1.style.color='black';}
        }
        else{tip1.innerHTML="请输入合法的手机号！";tip1.style.color='black';}
    }
    else{tip1.innerHTML="请输入合法的手机号！";tip1.style.color='black';}
}
function login(){
    let account=document.querySelector("input[name=account]").value;
    let password=document.querySelector("input[name=password]").value;
    let tip2=document.querySelector(".tip2");
    account=Number(account);
    password=SHA256(password);
    if(account!=NaN&&password){
    let data={"id":account,"password":`${password}`};
    fetch("http://39.97.228.101:8080/kuro/login",{
        method: "POST",
        body: JSON.stringify(data),
    }).then(checkStatus).then(res => res.json()).then(function (response){
        response=eval(response);
        skey=response.skey;
        turnTo("main",skey);
    }).catch(function(err){
        tip2.innerHTML="输入的帐号或密码不正确，请重新输入！";tip2.style.color="black";
        document.querySelector("input[name=account]").value="";
        document.querySelector("input[name=password]").value="";
    })
    }
    else{tip2.innerHTML="请输入合法的帐号和密码!";tip2.style.color="red";}
}
function getCalendar(){
    getPoem();
    var month_olypic = [31,29,31,30,31,30,31,31,30,31,30,31];
    var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
    var month_name =["January","Febrary","March","April","May","June","July","Auguest","September","October","November","December"]
    var holder = document.getElementById("days");
    var ctitle = document.getElementById("calendar-title");
    var cyear = document.getElementById("calendar-year");
    var my_date = new Date();
    var my_year = my_date.getFullYear();
    var my_month = my_date.getMonth(); 
    var my_day = my_date.getDate();
    function dayStart(month,year){
        var tmpDate = new Date(year, month, 1);
        return (tmpDate.getDay());
    }
    function daysMonth(month, year){
        var tmp1 = year % 4;
        var tmp2 = year % 100;
        var tmp3 = year % 400;
        if((tmp1 == 0 && tmp2 != 0) || (tmp3 == 0)){
            return (month_olypic[month]);
        }else{
            return (month_normal[month]);
        }
    }
    function refreshDate(){
        var str = "";
        var totalDay = daysMonth(my_month,my_year);
        var firstDay = dayStart(my_month, my_year);
        for(var i = 0; i < firstDay; i++){
            str += "<li>"+"</li>";
        }
        var myclass;
        for(var i = 1; i <= totalDay; i++){
            if((my_year < my_date.getFullYear())||(my_year == my_date.getFullYear() && my_month < my_date.getMonth()) || (my_year == my_date.getFullYear() && my_month == my_date.getMonth() && i < my_day)){
                myclass = " class='darkgrey'";
            }else if(my_year == my_date.getFullYear() && my_month == my_date.getMonth() && i == my_day){
                myclass = "class = 'green greenbox'";
            }else{
                myclass = "class = 'lightgrey'";
            }
            str += "<li "+myclass+">"+i+"</li>";
        }
        holder.innerHTML = str;
        ctitle.innerHTML = month_name[my_month];
        cyear.innerHTML = my_year;
    }
    refreshDate();
}
function getIn(){
    let enter=document.querySelector(`#enter`);
    let start=document.querySelector(`#start`);
    let body=document.querySelector(`body`);
    enter.style.display="none";
    start.style.display="block";
    body.style.backgroundImage="url(source/背景1.png)";
}