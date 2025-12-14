import { Controller, Post, Body, Res, HttpStatus, Patch, Param, Put, Get, UseGuards, Delete, Req, Query } from '@nestjs/common';
import { SuppliersService } from '../services/suppliers.service';
import { Response,Request } from 'express';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { CreatePaymentDto } from '../models/dto/payments/create-payment.dto';
import { UpdatePaymentDto } from '../models/dto/payments/update-payment.dto';
import { PaymentsService } from '../services/payments.service';
import { AuthService } from '../services/auth.service';

@Controller('service/api/v1/payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService,private readonly authService: AuthService) {
    console.log('PaymentsController constructor');
  }
  
  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async add(
    @Body() dto: CreatePaymentDto,
    @Res() res: Response,
    @Req() req: Request,
   ) {
    console.log(dto);
    const user = await this.authService.userConnected(req.headers.authorization);
    if(!user.name) return res.status(403).json({message: 'Token Signature could not be verified with authenticiation.',error: 'Token validation failed'});
    const reponse = await this.service.create(dto,user);   
    return res.status(reponse.code).json(reponse);
  }



  @Post('/hellopay-callback')
  async callback(
    @Body() data: any,
    @Res() res: Response,
   ) {
    console.log("DATA_CALL_BACK",data);
    const reponse = await this.service.callbackExecute(data);   
    return res.status(reponse.code).json(reponse);
  }


//   @Put('/edit/:id')
//   @UseGuards(JwtAuthGuard)
//   async edit(
//     @Param('id') id: string,
//     @Res() res: Response,
//     @Body() dto: UpdateOrderDto,
//    ) {
//     const reponse = await this.service.update(id, dto);   
//     return res.status(reponse.code).json(reponse);
//   }


  @Get("/all")
  @UseGuards(JwtAuthGuard)
  async getAllUser(
    @Req() req: Request,
    @Res() res: Response,
    @Query('transaction_id') transaction_id?: string,
    ) {
    const user = await this.authService.userConnected(req.headers.authorization);
    if(!user.name) return res.status(403).json({message: 'Token Signature could not be verified with authenticiation.',error: 'Token validation failed'});
    const reponse = await this.service.findAll(user,transaction_id == null?null:transaction_id);
    return res.status(reponse.code).json(reponse);
  }

 @Get("/all/paginate/:id")
 @UseGuards(JwtAuthGuard)
  async getAllUserPaginate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
    @Query('transaction_id') transaction_id?: string,
    ) {
    const user = await this.authService.userConnected(req.headers.authorization);
    if(!user.name) return res.status(403).json({message: 'Token Signature could not be verified with authenticiation.',error: 'Token validation failed'});
    const reponse = await this.service.findAllPaginate(id, 5,user,transaction_id == null?null:transaction_id);
    return res.status(reponse.code).json(reponse);
  }

  @Get("/show/:id")
  @UseGuards(JwtAuthGuard)
  async showUser(
    @Res() res: Response,
    @Param('id') id: string,
    ) {
    const reponse = await this.service.findOne(id);
    return res.status(reponse.code).json(reponse);
  }


  @Get("/status/:id")
  @UseGuards(JwtAuthGuard)
  async showStatus(
    @Res() res: Response,
    @Param('id') id: string,
    ) {
    const reponse = await this.service.findOneStatus(id);
    return res.status(reponse.code).json(reponse);
  }


  @Get("/cron-task")
  @UseGuards(JwtAuthGuard)
  async cron(
    @Res() res: Response,
    @Param('id') id: string,
    ) {
    const reponse = await this.service.cronTabFindStatus();
    return res.status(200).json(reponse);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @Res() res: Response
   ) {
    const reponse = await this.service.remove(id);   
    return res.status(reponse.code).json(reponse);
  }

}
