function doStuff(data, callback) {
    callback(data);
}

doStuff("Uses Callback ", (result) => console.log(result));
console.log(".........................");

function doPromiseStuff(data) {
    return new Promise((resolve, reject) => {
        let successMessage = {
            status: "Success",
            message: "Everything went well!"
        }
        let failureMessage = {
            status: "Failure",
            message: "There was an error!!"
        }
        if (typeof data === "string") {
            resolve(successMessage);
        } else {
            reject(failureMessage);
        }
    })
}

console.log(".........................");

doPromiseStuff("Resolve").then(successMessage => {
    console.log(successMessage);
}).catch(errorMessage => {
    console.log(errorMessage);
}).finally(() => {
    console.log("Finally !")
});

console.log(".........................");
doPromiseStuff(true).then(successMessage => {
        console.log(successMessage);
    }, (errorMessage) => {
        console.log(errorMessage);
    }
);
