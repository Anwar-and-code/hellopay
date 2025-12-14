import { Controller, Post, Body, Res, HttpStatus, Patch, Param, Put, Get, UseGuards, Delete, Req } from '@nestjs/common';
import { DeliveriesService } from '../services/deliveries.service';
import { Response,Request } from 'express';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { CreateDeliveryDto } from '../models/dto/deliveries/create-delivery.dto';
import { UpdateDeliveryDto } from '../models/dto/deliveries/update-delivery.dto';


@Controller('service/api/v1/deliveries')
export class DeliveriesController {
  constructor(private readonly service: DeliveriesService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async add(
    @Body() dto: CreateDeliveryDto,
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
    @Body() dto: UpdateDeliveryDto,
   ) {
    const reponse = await this.service.update(id, dto);   
    return res.status(reponse.code).json(reponse);
  }


  @Get("/all")
  @UseGuards(JwtAuthGuard)
  async getAllUser(
    @Res() res: Response
    ) {
    const reponse = await this.service.findAll();
    return res.status(reponse.code).json(reponse);
  }

 @Get("/all/paginate/:id")
 @UseGuards(JwtAuthGuard)
  async getAllUserPaginate(
    @Res() res: Response,
    @Param('id') id: number,
    ) {
    const reponse = await this.service.findAllPaginate(id, 10);
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
