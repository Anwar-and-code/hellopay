import { Controller, Post, Body, Res, HttpStatus, Patch, Param, Put, Get, UseGuards, Delete, Req, Query } from '@nestjs/common';
import { SuppliersService } from '../services/suppliers.service';
import { Response,Request } from 'express';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { CreateOrderDto } from '../models/dto/orders/create-order.dto';
import { UpdateOrderDto } from '../models/dto/orders/update-order.dto';
import { OrdersService } from '../services/orders.service';
import { AuthService } from '../services/auth.service';

@Controller('service/api/v1/orders')
export class ordorsController {
  constructor(private readonly service: OrdersService, private readonly authService: AuthService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async add(
    @Body() dto: CreateOrderDto,
    @Res() res: Response
   ) {
    console.log(dto);
    const reponse = await this.service.create(dto);   
    return res.status(reponse.code).json(reponse);
  }


  // @Put('/edit/:id')
  // @UseGuards(JwtAuthGuard)
  // async edit(
  //   @Param('id') id: string,
  //   @Res() res: Response,
  //   @Body() dto: UpdateOrderDto,
  //  ) {
  //   const reponse = await this.service.update(id, dto);   
  //   return res.status(reponse.code).json(reponse);
  // }


  @Get("/all")
  @UseGuards(JwtAuthGuard)
  async getAllUser(
    @Res() res: Response,
    @Req() req: Request,
    @Query('code') code?: string,
    ) {
    const user = await this.authService.userConnected(req.headers.authorization);
    if(!user.name) return res.status(403).json({message: 'Token Signature could not be verified with authenticiation.',error: 'Token validation failed'});
    const reponse = await this.service.findAll(user,code == null?null:code);
    return res.status(reponse.code).json(reponse);
  }

 @Get("/all/paginate/:id")
 @UseGuards(JwtAuthGuard)
  async getAllUserPaginate(
    @Res() res: Response,
    @Param('id') id: number,
    @Req() req: Request,
    @Query('code') code?: string,
    ) {
    const user = await this.authService.userConnected(req.headers.authorization);
    if(!user.name) return res.status(403).json({message: 'Token Signature could not be verified with authenticiation.',error: 'Token validation failed'});
    const reponse = await this.service.findAllPaginate(id, 5,user,code == null?null:code);
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
