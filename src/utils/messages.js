const generateMessage  =(displayName, message)=>{
    return {
        displayName,
        createdAt : new Date().getTime(),
        text: message
    }
}

const generateLocationMsg = (displayName,location)=>{
    return {
        displayName,
        createdAt: new Date().getTime(),
        locationText: location
    }
}

module.exports ={generateMessage, generateLocationMsg};