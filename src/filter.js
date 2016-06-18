export let getTime = (time) => {
    if(!time) return ''
    var date = new Date(time)
    var hour = date.getHours()
    var min = date.getMinutes()
    if(min< 10) min = '0' + min
    return (hour + ':' + min)
}

export let strLen = (str, len = 12) => {
    if (str && str.length > len) {
        str = str.substring(0, len) + '...'
    }
    return str
}