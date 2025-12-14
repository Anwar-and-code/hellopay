import { Controller, Post, Body, Res, HttpStatus, Patch, Param, Put, Get, UseGuards, Delete, Req, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response,Request } from 'express';
import { LoginUserDto } from '../models/dto/user/login-user.dto';
import { CreateUserDto } from '../models/dto/user/create-user.dto';
import { UpdateUserDto } from '../models/dto/user/update-user.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';


@Controller('service/api/v1/user')
export class authenticationController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() userData: LoginUserDto,
    @Res() res: Response
  ) {
    const reponse = await this.authService.Userslogin(
      userData.email,
      userData.password
    );   
    return res.status(reponse.code).json(reponse);
  }


  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async add(
    @Body() userData: CreateUserDto,
    @Res() res: Response
   ) {
    console.log(userData);
    const reponse = await this.authService.create(userData);   
    return res.status(reponse.code).json(reponse);
  }


  @Put('/edit/:id')
  @UseGuards(JwtAuthGuard)
  async edit(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() dto: UpdateUserDto,
   ) {
    const reponse = await this.authService.update(id, dto);   
    return res.status(reponse.code).json(reponse);
  }


  @Get("/all")
  @UseGuards(JwtAuthGuard)
  async getAllUser(
    @Res() res: Response,
    @Query('name') name?: string
    ) {
    const reponse = await this.authService.getAll(name == null ? null : name);
    return res.status(reponse.code).json(reponse);
  }

 @Get("/all/paginate/:id")
 @UseGuards(JwtAuthGuard)
  async getAllUserPaginate(
    @Res() res: Response,
    @Param('id') id: number,
    @Query('name') name?: string,
    ) {
      console.log('name', name);
    const reponse = await this.authService.getAllPaginate(id, 10, name == null ? null : name);
    return res.status(reponse.code).json(reponse);
  }

  @Get("/show/:id")
  @UseGuards(JwtAuthGuard)
  async showUser(
    @Res() res: Response,
    @Param('id') id: string,
    ) {
    const reponse = await this.authService.show(id);
    return res.status(reponse.code).json(reponse);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @Res() res: Response
   ) {
    const reponse = await this.authService.delete(id);   
    return res.status(reponse.code).json(reponse);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request, @Res() res: Response) {
    const response = await this.authService.userConnected(req.headers.authorization);
    return res.status(HttpStatus.OK).json({message:"User connected", success:true, data:response,});
  }
}
