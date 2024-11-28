import {
    createParamDecorator,
    ExecutionContext
} from '@nestjs/common'

export const currentUser = createParamDecorator(
    // data is incomming request
    // context is the wrap around to the request.. if it were to send http requrest it would be just context:request
    // but context:Executioncontext means the request can we webstocket request, graphql, grpc request or anything like that
    (data:never,context:ExecutionContext)=>{
        const request = context.switchToHttp().getRequest();
        console.log(request.session.userId)
        return request.currentUser;
    }
)