import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { ResponseHelper } from '../utils/response.helper';
import axios, { AxiosInstance, AxiosError } from 'axios';

type JsonRecord = Record<string, any>;

interface LoginPayload {
  email: string;
  password: string;
}

interface PaymentPayload {
  currency: string;
  payment_method: string; 
  merchant_transaction_id: string;
  amount: number;
  telephone: string;
  success_url: string;
  failed_url: string;
  notify_url: string;
  refercence_cl: string;
}

@Injectable()
export class ProviderPaymentsService {
  private readonly logger = new Logger(ProviderPaymentsService.name);
  private readonly client: AxiosInstance;
  private readonly Auth : LoginPayload = {
    email: 'cherubin0225@gmail.com',
    password: 'kvJeNxK',
  }
  public readonly referenceCl = 'bU8zhu3';
  public readonly success_url = 'https://www.hello-pay.com/success';
  public readonly failed_url = 'https://www.hello-pay.com/failed';
  public readonly notify_url = 'https://www.hello-pay.com/notify';
  public readonly payment_method = ['CM_PM_OM','CM_CASHIN_OM','CM_PM_MTN','CM_CASHIN_MTN','GN_CASHIN_MTN','GN_PM_MTN','GN_CASHIN_OM','GN_PM_OM','GB_CASHIN_AIRTEL','GB_PM_AIRTEL','BN_PM_MTN','BN_CASHIN_MTN','BF_PM_OM','BF_CASHIN_OM',"BF_PM_MOOV","BF_CASHIN_MOOV","WAVE_CI","OM_CI","MTN_CI","MOOV_CI","OM_SN","SN_PM_OM","SN_PM_WAVE","SN_CASHIN_OM","SN_CASHIN_WAVE"];
  private readonly base_url = 'https://v2.b-pay.co';

  constructor() {
    this.client = axios.create({
      baseURL: this.base_url,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private extractToken(data: any): string | undefined {
    return data?.authorisation?.token;
  }

  private toAxiosErrorDetails(error: AxiosError) {
    return {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }



  // 2) Initier paiement après login (utilise le bearer token reçu)
  async initiatePaymentWithLogin(paymentPayload: PaymentPayload) {
    const date = new Date().toISOString();
    try {
      const token = await this.getToken(this.Auth);

      if(token.success == false){
        return ResponseHelper.error('Error Authentication during request', HttpStatus.UNAUTHORIZED, 'Error Authentication during request');
      }

      if (!this.payment_method.includes(paymentPayload.payment_method)){
        return ResponseHelper.error('Payment method not supported', HttpStatus.BAD_REQUEST, 'Invalid payment method');
      }

      console.log("PAYMENT_PAYLOAD",paymentPayload)
      const res = await this.client.post('/service/api/v1/paiement', paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("RESPONSE_OF_REQUEST_PAYMENT",res.data)

      this.logger.log(`[${date}] Payment initiated: merchant_transaction_id=${paymentPayload.merchant_transaction_id}`);
      return ResponseHelper.success(res.data, 'Payment initiated successfully');
    } catch (error: any) {
      const details = axios.isAxiosError(error) ? this.toAxiosErrorDetails(error) : error;
      this.logger.error(`[${date}] Payment initiation error: ${error.message}`, error.stack);
      console.log("ERROR_DETAILS",details)
      return ResponseHelper.error('Error initiating payment', HttpStatus.INTERNAL_SERVER_ERROR, null, details);
    }
  }
  
  async verifyStatusWithLogin(
    transaction_id?: string,
  ) {
    const date = new Date().toISOString();
    try {

      const token = await this.getToken(this.Auth);

      if(token.success == false){
        return ResponseHelper.error('Error Authentication during request', HttpStatus.UNAUTHORIZED, 'Error Authentication during request');
      }

      if (!transaction_id) {
        return ResponseHelper.error('Transaction ID is required', HttpStatus.BAD_REQUEST, 'Missing transaction ID');
      }

      var res = await this.client.get(`/service/api/v1/check-status/${transaction_id}`, {
        headers: { Authorization: `Bearer ${token}` },
     });
      
      this.logger.log(`[${date}] Status verification success on /service/api/v1/check-status/${transaction_id}`);
      return ResponseHelper.success3(res.data, 'Status verified');
    } catch (error: any) {
      const details = axios.isAxiosError(error) ? this.toAxiosErrorDetails(error) : error;
      this.logger.error(`[${date}] Status verification error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error verifying status', HttpStatus.INTERNAL_SERVER_ERROR, null, details);
    }
  }
  
  private async getToken(loginPayload: LoginPayload): Promise<any> {
    try {
      const res = await this.client.post('/service/api/v1/oauth/login', loginPayload);
      console.log('RESPONSE_OF_REQUEST_LOGIN',res.data.message)
      const token = this.extractToken(res.data);
      console.log("TOKEN_EXTRACTED",token)
      if (!token) {
        return ResponseHelper.error('Error Authentication during request', HttpStatus.UNAUTHORIZED, null);
      }
      return token;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw this.toAxiosErrorDetails(error);
      }
      throw error;
    }
  }
}