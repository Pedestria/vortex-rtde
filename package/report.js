// const test = require('./test/cjsiife');

// test.hello();
// console.log(test.LodashVersion);

var regex = "\.ttf|\.png|\.jpe?g"

var otherregex = "\.css"

var combined = new RegExp(`(${regex}|${otherregex})$`);

console.log(combined)