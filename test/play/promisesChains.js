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
console.log("Two resolve, one reject.........................");
doPromiseStuff("I am a String").then((data) => {
        console.log("First Resolve:", data);
        return doPromiseStuff("Again a String")
    }
).then((data) => {
        console.log("Second Resolve:", data);
        return doPromiseStuff(true)
    }
).then((data) => {
        console.log("Third Resolve:", data);
    }
).catch((data) => {
    console.log("First Reject:", data);
})

console.log("Only one Reject.........................");
doPromiseStuff(true).then((data) => {
        console.log("First Resolve:", data);
        return doPromiseStuff("Again a String")
    }
).then((data) => {
        console.log("Second Resolve:", data);
        return doPromiseStuff(true)
    }
).then((data) => {
        console.log("Third Resolve:", data);
    }
).catch((data) => {
    console.log("First Reject:", data);
})
