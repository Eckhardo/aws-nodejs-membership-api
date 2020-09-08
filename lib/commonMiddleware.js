
module.exports = {
    middy :  require('@middy/core'),
    httpJsonBodyParser : require('@middy/http-json-body-parser'),
    httpEventNormalizer: require('@middy/http-event-normalizer'),
    httpErrorHandler: require('@middy/http-error-handler'),
    httpCors:require('@middy/http-cors'),
    validator: require('@middy/validator')
}
