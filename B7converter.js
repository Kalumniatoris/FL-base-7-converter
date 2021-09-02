// ==UserScript==
// @name         FL base (7)+
// @namespace    http://tampermonkey.net/
// @version      0.2.12
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
    window.addEventListener('urlchange',(x)=>{setTimeout(rep,0);console.log(x)});
    }


setTimeout(rep,0);
function rep(){

//run-at document-idle (or -end) was too slow. Timeout too ureliable.
(new MutationObserver(check)).observe(document, {childList: true, subtree: true});
    (new MutationObserver(checkBazaar)).observe(document, {childList: true, subtree: true});


}
})();


function checkBazaar(changes, observer) {

    //workaround for bazaar (not that it actually works correctly) it doesn't allow changing shops

    //.shop-item to break it even more
    if(document.querySelector('.shop')) {
     observer.disconnect();
     setTimeout(()=>{ replace('.shop');},100);
    }
}


function check(changes, observer) {

    //seems to be loading after main content
    if(document.querySelector('.footer-content')) {
     observer.disconnect();
     setTimeout(()=>{ replace('#root');},0);
    }
}



function replace(target){
    replaceInText(document.querySelector(target),/\d+/g,(x)=>{return x>7?`(${c3(x,7)})`:x==7?`7`:x})
   //   replaceInText(document.querySelector(target),/\d+/g,(x)=>{return x>7?`(${c3(x,7)})`:x==7?`YY7YY`:x})

  // replaceInText(document.querySelector(target),/YY[7]YY/,(x)=>{return `7`},"font-size:120%;font-weight:bold")
}


//TODO - work on powers
function c3(x,b=7){

   let base=cbase(x,b);
    let val=x-x%base;

    if(x<b){return x}
    if(x==b){return `${x}`}
  //  if(x==b ){return `YY${x}YY`}

    let mult=val/base>1?`${val/base}*`:``;

    let rest=c3(x%base,b);
    let restStr=rest==0?'':`+${rest}`;

   let baseStr='';
    while(base>1){
  //   baseStr+=`YY${b}YY`
        baseStr+=`${b}`
        base/=10;
    }

  //  return `${mult}<span style:"font-size:180%;">${base}<span>${restStr}`
return `${mult}${baseStr}${restStr}`
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





//https://stackoverflow.com/a/50537862  ; slightly modified to allow adding tags NOT
//https://stackoverflow.com/a/7698745

//Actually, do not look inside;

//
function replaceInText(element, pattern, replacement) {
    if(element==null)return;
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceInText(node, pattern, replacement);
                break;
            case Node.TEXT_NODE:
                {
                let u = node.nodeValue;
                node.replaceWith(u.replace(pattern,replacement));
                }

                break;
            case Node.DOCUMENT_NODE:
                replaceInText(node, pattern, replacement);
        }
    }
}


/*function replaceInText(element, pattern, replacement, addStyle=false,target=7) {
    if(element==null)return;
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceInText(node, pattern, replacement,addStyle);
                break;
            case Node.TEXT_NODE:

                if(!addStyle){
                let u = node.nodeValue;
                node.replaceWith(u.replace(pattern,replacement));
                }
                else{

                //    console.log("\n\n\n",node.parentNode.innerHTML,"\n\n",node.parentNode.nodeValue,"\n\n\n\n");

                    let reg=new RegExp(`YY${target}YY`,'g')
                  node.parentNode.innerHTML=node.parentNode.innerHTML.replaceAll(reg, (x)=>{return `<span style="${addStyle}">${target}</span>`});//(x)=>{return `<span style="color:red">7<span>`});


                }
                break;
            case Node.DOCUMENT_NODE:
                replaceInText(node, pattern, replacement,addStyle);
        }
    }
}*/
