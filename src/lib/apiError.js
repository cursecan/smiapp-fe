export class ApiError extends Error {
    constructor(message, status, data=null) {
        super(message);
        this.status = status;
        this.name = "ApiError";
        this.data = data;
    }
}