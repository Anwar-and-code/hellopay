import { Controller, Post, Body, Res, HttpStatus, Patch, Param, Put, Get, UseGuards, Delete, Req, Query } from '@nestjs/common';
import { SuppliersService } from '../services/suppliers.service';
import { Response,Request } from 'express';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { CreatePaymentPlanDto } from '../models/dto/payment_plan/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from '../models/dto/payment_plan/update-payment-plan.dto';
import { PaymentPlansService } from '../services/payment-plans.service';

@Controller('service/api/v1/payments-plan')
export class paymentPlanController {
  constructor(private readonly service: PaymentPlansService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async add(
    @Body() dto: CreatePaymentPlanDto,
    @Res() res: Response
   ) {
    console.log(dto);
    const reponse = await this.service.create(dto);   
    return res.status(reponse.code).json(reponse);
  }


  @Put('/edit/:id')
  @UseGuards(JwtAuthGuard)
  async edit(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() dto: UpdatePaymentPlanDto,
   ) {
    const reponse = await this.service.update(id, dto);   
    return res.status(reponse.code).json(reponse);
  }


  @Get("/all")
  // @UseGuards(JwtAuthGuard)
  async getAllUser(
    @Res() res: Response,
    @Query('name') name?: string,
    ) {
    const reponse = await this.service.findAll(name == null ? null : name);
    return res.status(reponse.code).json(reponse);
  }

 @Get("/all/paginate/:id")
//  @UseGuards(JwtAuthGuard)
  async getAllUserPaginate(
    @Res() res: Response,
    @Param('id') id: number,
    @Query('name') name?: string,
    ) {
    const reponse = await this.service.findAllPaginate(id, 5, name == null ? null : name);
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
