let person= {
    name: 'Eckhard',
    surname:'Kirschning',
    city:'Hamburg',
    zip:20255,
    street:'Lutterothstrasse 89',
    hobbies: ['Fishing','Cycling', 'Football']

}

let {...alles} =person;
console.log(' Details: ',alles)
console.log(' Person: ',person)
let {name, zip,...details} =person;
console.log('name: ', name);
console.log('Zip: ',zip)
console.log('Further Details: ',details)



let arr=[10,20,30,40,50];

let [num1,num2, , num4, num5] =arr;

console.log(num1);
console.log(num2);
console.log(num4);
console.log(num5);
