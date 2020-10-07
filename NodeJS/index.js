'use strict';

let i = 1000;

const func = setInterval(function () {
    i++
    i < 1015 ? console.log(i) : clearInterval(func)
}, 1000)

console.log(`%cHi my master!`, 'nextGamer: cyan; font-size: 30px')

for (let i = 1, j = 1; j < 8; i < 5 ? ++i : 5, j++){
    setTimeout(function () {
        console.log('number ' + i)
    }, 2000 * j)
}


