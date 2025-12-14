import { HttpStatus } from '@nestjs/common';

export class ResponseHelper {
  static success(data: any, message: string = 'Success',statut: any = 'Success') {
    //console.log('data_user ',data_user); 
    return {
        status: statut,
        success: true,
        code: HttpStatus.OK,
        message: message,
        data:data,
      };
  }

    static success3(data: any, message: string = 'Success',statut: any = 'Success') {
    //console.log('data_user ',data_user); 
    return {
        status: statut,
        success: true,
        code: HttpStatus.OK,
        message: message,
        ...data,
      };
  }

  static success2(data: any, message: string = 'Success',statut: any = 'Success') {
    //console.log('data_user ',data_user); 
    return {
        status: statut,
        success: true,
        code: HttpStatus.OK,
        message: message,
        data:data,
      };
  }


    static successPaginate(data: any, message: string = 'Success',statut: any = 'Success') {
    return {
        status: statut,
        success: true,
        code: HttpStatus.OK,
        message: message,
        ...data,
      };
  }

  static successTransaction(data: any, message: string = 'Success',statut: any = 'Success') {
    //console.log('data_user ',data_user); 
    return {
        status: statut,
        success: true,
        code: HttpStatus.OK,
        message: message,
        data:data,
      };
  }

  static error(description?:string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR, message?: string, error?: any) {
    const statusMessages = {
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error occurred',
      [HttpStatus.BAD_REQUEST]: 'Invalid request parameters',
      [HttpStatus.NOT_FOUND]: 'Resource not found',
      [HttpStatus.FORBIDDEN]: 'Access denied'
    };
    
    return {
      status: "error",
      description:description || statusMessages[status] || 'An unexpected error occurred',
      success: false,
      code: status,
      message: message || statusMessages[status] || 'An unexpected error occurred',
      error: error?.stack || error,
    };
  }


  static errorRetrait(description?:string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR, message?: string, error?: any,merchant_transaction_id=null) {
    const statusMessages = {
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error occurred',
      [HttpStatus.BAD_REQUEST]: 'Invalid request parameters',
      [HttpStatus.NOT_FOUND]: 'Resource not found',
      [HttpStatus.FORBIDDEN]: 'Access denied'
    };
    
    return {
      status: description,
      description:description || statusMessages[status] || 'An unexpected error occurred',
      success: false,
      code: status,
      message: message || statusMessages[status] || 'An unexpected error occurred',
      error: error?.stack || error,
      merchant_transaction_id:merchant_transaction_id
    };
  }
}




