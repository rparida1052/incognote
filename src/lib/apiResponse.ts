

const apiResponse = ({success, status, message}:{success:boolean,status:number,message:string}) => {
    return Response.json(
        {
            success:success,
            message:message,
        },
        {
            status:status
        }
    )

}