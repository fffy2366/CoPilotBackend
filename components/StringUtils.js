StringUtils = {} ;

StringUtils.isEmpty = function(obj){
	for (var name in obj){
        return false;
    }
    return true;
}

module.exports = StringUtils ;