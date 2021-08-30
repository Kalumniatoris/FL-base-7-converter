// ==UserScript==
// @name         FL base (7)+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  More 'useful' number system
// @author       Kalumniatoris
// @match        https://www.fallenlondon.com/*
// @icon         https://www.google.com/s2/favicons?domain=fallenlondon.com
// @grant        window.onurlchange


// ==/UserScript==

(function() {
    'use strict';


    //To alow changing tabs.
    if (window.onurlchange === null) {
    window.addEventListener('urlchange', () =>replace());
    }




//run-at document-idle (or -end) was too slow. Timeout too ureliable.
(new MutationObserver(check)).observe(document, {childList: true, subtree: true});
function check(changes, observer) {

    //seems to be loading after main content
    if(document.querySelector('.footer-content')) {
      observer.disconnect();
      replace();
    }
}


})();


function replace(){
console.log("replacing");
replaceInText(document.getElementById('root'),/\d+/g,(x)=>{return x>7?`(${c3(x,7)})`:x})


    //VVV Looks as expected but breaks page (no link would work even at document.body.innerHTML=document.body.innerHTML)
 //   document.body.innerHTML=document.body.innerHTML.replaceAll('QWE','<span style=" font-size:smaller">(');
 //    document.body.innerHTML=document.body.innerHTML.replaceAll('EWQ',')</span>');

//    document.body.innerHTML=document.body.innerHTML.replaceAll('QLQ','<span style="font-size:larger">');
//   document.body.innerHTML=document.body.innerHTML.replaceAll('QRQ','</span>');
}


//TODO - work on powers
function c3(x,b=7){

   let base=cbase(x,b);



    let val=x-x%base;

    if(x<b){return x}
    if(x==base){return `${x}`}
    let mult=val/base>1?`${val/base}*`:``;

    let rest=c3(x%base,b);
    let restStr=rest==0?'':`+${rest}`;
    return `${mult}${base}${restStr}`

}



//Gets closest number with all repeating digits lower than x. E.g. cbase(13123,7)=7777,cbase(83123,7)=77777
function cbase(x,digit){
    if(x<digit){return digit}
let len=x.toString().length;
let n;
let base=0;
for(n=0;n<len-1;n+=1){
   base=base*10+digit;
  //base+=digit*Math.pow(10,n);
}
//
if(x>=(base*10+digit)){
    base=base*10+digit;
}
if (base==0){base=digit}
return base;
}




//I am not happy with using it, I would prefer regex that match it correctly but trying to get it to ignore tags was too annoying.
//Not to say that .replaceAll doesn't exactly works correctly here due to how page is loaded or something
//https://stackoverflow.com/a/50537862
function replaceInText(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceInText(node, pattern, replacement);
                break;
            case Node.TEXT_NODE:
                node.textContent = node.textContent.replace(pattern, replacement);
                break;
            case Node.DOCUMENT_NODE:
                replaceInText(node, pattern, replacement);
        }
    }
}
