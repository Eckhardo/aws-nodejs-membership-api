function add(...input) {
    let sum = 0;
    input.forEach(int => sum += int);
    return sum;
}
console.log(add(3,4,5));
let arr = [2, 3, 4, 5, 6];
console.log(add(...arr));

function addMix(a,...input) {
    console.log("a: ", a);
    let sum =a;
    input.forEach(int => sum += int);
    return sum;
}
console.log(addMix(3,4,5));
console.log(addMix(...arr));
