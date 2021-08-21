let dateTransformer = {};


function dateToString(date){
    let options = {year: 'numeric', month: 'long', day: 'numeric', hour12: true, hour: "2-digit", minute: "2-digit"};
    return `${new Date(date).toLocaleDateString("es-ES", options) } `
}


function resultToTable(result){
    result.date_creation = dateToString(result.date_creation);
    result.last_update = dateToString(result.last_update);
}


dateTransformer.dateToString = dateToString;
dateTransformer.resultToTable = resultToTable;

module.exports = dateTransformer