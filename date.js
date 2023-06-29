
const getDate = ()=>{
var today = new Date();
var curDay = today.getDay();

var options = {
    weekday : "long",
    day : "numeric",
    month : "long"
};

var day =today.toLocaleDateString('en-us',options);
return day;
}

module.exports.getDay = ()=>{
    var today = new Date();
    var curDay = today.getDay();
    
    var options = {
        weekday : "long"
    };
    
    var day =today.toLocaleDateString('en-us',options);
    return day;
    }

module.exports.getDate = getDate;