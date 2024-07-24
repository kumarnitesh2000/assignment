class StandardResponse{
    constructor(_message,_status){
        this.message = _message;
        this.status = _status; 
    }
    getResponse(){
        return {
            "message": this.message,
            "status": this.status,
        }
    }
}

module.exports = StandardResponse;