import { Controller, Post, Body, Res, HttpStatus, Patch, Param, Put, Get, UseGuards, Delete, Req, Query } from '@nestjs/common';
import { SuppliersService } from '../services/suppliers.service';
import { Response,Request } from 'express';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { CreateProductDto } from '../models/dto/produits/create-product.dto';
import { UpdateProductDto } from '../models/dto/produits/update-product.dto';
import { ProductsService } from '../services/products.service';


@Controller('service/api/v1/produits')
export class produitsController {
  constructor(private readonly service: ProductsService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async add(
    @Body() dto: CreateProductDto,
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
    @Body() dto: UpdateProductDto,
   ) {
    const reponse = await this.service.update(id, dto);   
    return res.status(reponse.code).json(reponse);
  }


  @Get("/all")
  // @UseGuards(JwtAuthGuard)
  async getAllUser(
    @Res() res: Response,
    @Query('name') name?: string,
    @Query('categorie') categorie?: string,
    @Query('supplier') supplier?: string,
    ) {
    const reponse = await this.service.findAll(name == null ? null : name, categorie == null ? null : categorie,supplier == null ? null : supplier);
    return res.status(reponse.code).json(reponse);
  }

 @Get("/all/paginate/:id")
//  @UseGuards(JwtAuthGuard)
  async getAllUserPaginate(
    @Res() res: Response,
    @Param('id') id: number,
    @Query('name') name?: string,
    @Query('categorie') categorie?: string,
    @Query('supplier') supplier?: string,
    ) {
    const reponse = await this.service.findAllPaginate(id, 5, name == null ? null : name, categorie == null ? null : categorie,supplier == null ? null : supplier);
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
