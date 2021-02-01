let myArr= [10,20,30,40];
let count=0;
myArr.forEach( no => console.log(no));

console.log(".........................");
myArr.push(50);
while (count<myArr.length) {
  console.log(myArr[count]);
  count++;
}

console.log(".........................");
myArr.push(60);
for (let i of myArr ) {
    console.log(i);
}
console.log(".........................");
