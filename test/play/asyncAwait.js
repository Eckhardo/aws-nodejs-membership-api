function doPromiseStuff(data) {
    return new Promise((resolve, reject) => {
        let successMessage = {
            status: "Success",
            message: "Everything went well!",
            isClean: true
        }
        let failureMessage = {
            status: "Failure",
            message: "There was an error!!",
            isClean: false
        }
        setTimeout(() => {
        if (typeof data === "string") {
            console.log("RESOLVE");
            resolve(successMessage);
        } else {
            reject(failureMessage);
        }
        },1000);
    })
}


async function chainStuff() {
    let a = await doPromiseStuff("String");
    console.log(a);
    let b = await doPromiseStuff(a.status);
    console.log(b);
    let c = await doPromiseStuff(b.status);
    console.log(c);
    return c;
}

chainStuff().then((data) => {
    console.log("Caller:",data);
}).catch((err) => {
    console.log(err);
});
