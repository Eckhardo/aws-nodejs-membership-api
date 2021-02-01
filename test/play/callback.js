function add(a,b, callback) {
    console.log("add");
    callback(a+b);
}
console.log("...add finished");
function print(c) {
    console.log(c);
}
console.log("...print finished");
console.log(".........................");
add(2,3,print);

console.log(".........................");
// as inline function :
add(2,4, (c) => console.log(c));
