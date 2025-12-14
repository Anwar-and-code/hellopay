import { HttpStatus, Injectable, Logger,UnauthorizedException} from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Users } from '../models/Users';
import { ResponseHelper } from '../utils/response.helper';
import { FileLogger } from '../utils/logger';
import { authenticationController } from '../controllers/authentication.controller';
import { CreateUserDto } from '../models/dto/user/create-user.dto';
import { UpdateUserDto } from '../models/dto/user/update-user.dto';
import { paginateRepository } from '../utils/pagination.helper';
import { Like } from 'typeorm/find-options/operator/Like';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly writter_logger = new FileLogger(AuthService.name);
  constructor(
        @InjectRepository(Users)
        private readonly repository: UsersRepository,
        private jwtService: JwtService,
  ) {

  }

  private classModel = 'Users';

  async Userslogin(email: string,password:string ): Promise<any> {
    console.log("*********************************************************************");
    console.log("*********************** LOGIN TRAITEMENT ***************************");
    console.log("*********************************************************************");
    var payload = null;
    const date = new Date().toISOString();
    try{
      const user = await this.repository.findOne({ where: { email: email } , relations: ['orders.orderItems','payments',],});
      if (!user) {
        this.logger.error(`[${date}] Login error: user not found`);
        this.writter_logger.error(`Login failed for email: ${email} he is not found`);
        return ResponseHelper.error('user not found',HttpStatus.UNAUTHORIZED,null,'user not found');
      }
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        this.logger.error(`[${date}] Login error: user not found`);
        return ResponseHelper.error('Password is not good please retry with the good password',HttpStatus.UNAUTHORIZED,null,'Password is not good please retry with the good password');
      }
      var authorisation = {token:this.jwtService.sign({email: user.email, sub: user.id}),type:"bearer"}
      const { passwordHash: _, ...safe } = user as any;
      const payloads = {user: safe, authorisation};
      this.logger.log(`[${date}] Login success ${payloads.authorisation.type}`);
      payload =  ResponseHelper.success(payloads,"Login success");
    }catch(error){
      this.logger.error(`[${date}] Login error: ${error.message}`, error.stack);
      this.writter_logger.error(`Error in the login process ${error.message}`, error.stack);
      payload = ResponseHelper.error("Error in your login process",HttpStatus.INTERNAL_SERVER_ERROR,null,error.message),
      console.log('error',error)
    }
    return  payload;
  }  

  async create(dto: CreateUserDto): Promise<any> {
    const date = new Date().toISOString();
    try {
      console.log(dto.email);
      const existing = await this.repository.findOne({ where: { email: dto.email } });
      if (existing) {
        this.logger.error(`[${date}] Create ${this.Userslogin} error: email already exists`);
        return ResponseHelper.error('Email already exists', HttpStatus.CONFLICT, null, 'Email already exists');
      }

      const existing_num = await this.repository.findOne({ where: { phone: dto.phone } });
      if (existing_num) {
        this.logger.error(`[${date}] Create ${this.Userslogin} error: email already exists`);
        return ResponseHelper.error('Phone already exists', HttpStatus.CONFLICT, null, 'Phone already exists');
      }

      const passwordHash = await bcrypt.hash(dto.passwordHash, 10);
      const user = this.repository.create({
        name: dto.name,
        email: dto.email,
        phone: dto.phone ?? null,
        passwordHash: passwordHash,
        role: dto.role ?? 'client',
        dateNaissance: dto.dateNaissance ? new Date(dto.dateNaissance) : null,
        nom: dto.nom ?? null,
        prenom: dto.prenom ?? null,
        job: dto.job ?? null,
        habitation: dto.habitation ?? null,
      });

      const saved = await this.repository.save(user);
      // Ne pas exposer passwordHash dans la réponse
      const { passwordHash: _, ...safe } = saved as any;

      this.logger.log(`[${date}] Create ${this.classModel} success: ${safe.email}`);
      this.writter_logger.log(`Create ${this.classModel} success: ${safe.email}`);
      return ResponseHelper.success(safe, this.classModel+' created');
    } catch (error) {
      this.logger.error(`[${date}] Create ${this.classModel} error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error creating '+this.classModel, HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async getAll(name:string): Promise<any> {
    const date = new Date().toISOString();
    try {
      const users = await this.repository.find({
        relations: ['orders.orderItems','payments',],
        where: name ? { name: Like(`%${name}%`) } : {},
        order: { createdAt: 'DESC' as any },
      });
      const safeUsers = users.map((u: any) => {
        const { passwordHash, ...safe } = u;
        return safe;
      });

      this.logger.log(`[${date}] Get all users success: count=${safeUsers.length}`);
      this.writter_logger.log(`Get all users success: count=${safeUsers.length}`);
      return ResponseHelper.success(safeUsers, 'Users list');
    } catch (error) {
      this.logger.error(`[${date}] Get all users error: ${error.message}`, error.stack);
      this.writter_logger.error(`Error getting users: ${error.message}`, error.stack);
      return ResponseHelper.error('Error getting users', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }
  
  async getAllPaginate(page = 1, limit = 10, name?: string): Promise<any> {
    const date = new Date().toISOString();
    try {
      const { data, meta } = await paginateRepository(this.repository as any, {
        page,
        limit,
        order: { createdAt: 'DESC' },
        relations: ['orders.orderItems','payments',],
        where: name ? { name: Like(`%${name}%`) } : {},
        mapFn: (u: any) => {
          const { passwordHash, ...safe } = u;
          return safe;
        },
      });

      this.logger.log(`[${date}] Get ${this.classModel} paginated success: count=${data.length} page=${meta.page} limit=${meta.limit}`);
      this.writter_logger.log(`Get ${this.classModel} paginated success: count=${data.length} page=${meta.page} limit=${meta.limit}`);
      return ResponseHelper.successPaginate({ data, meta }, 'list'+this.classModel+'(paginated)');
    } catch (error) {
      this.logger.error(`[${date}] Get ${this.classModel} paginated error: ${error.message}`, error.stack);
      this.writter_logger.error(`Error getting paginated ${this.classModel}: ${error.message}`, error.stack);
      return ResponseHelper.error('Error getting '+this.classModel+'(paginated)', HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }
  
  async show(id: string): Promise<any> {
    const date = new Date().toISOString();
    try {
      const user = await this.repository.findOne({ where: { id }, relations: ['orders.orderItems','payments',] });
      if (!user) {
        this.logger.error(`[${date}] Get ${this.classModel} error: ${this.classModel} not found: ${id}`);
        this.writter_logger.error(`Get ${this.classModel} failed, ${this.classModel} not found: ${id}`);
        return ResponseHelper.error(this.Userslogin+' not found', HttpStatus.NOT_FOUND, null, this.Userslogin+' not found');
      }

      const { passwordHash, ...safe } = user as any;
      this.logger.log(`[${date}] Get ${this.classModel} success: ${safe.email ?? safe.id}`);
      return ResponseHelper.success(safe, 'User detail');
    } catch (error) {
      this.logger.error(`[${date}] Get ${this.classModel} error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error getting '+this.classModel, HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<any> {
    const date = new Date().toISOString();
    try {
      const user = await this.repository.findOne({ where: { id } });
      if (!user) {
        this.logger.error(`[${date}] Update ${this.classModel} error: ${this.classModel} not found`);
        return ResponseHelper.error(this.Userslogin+' not found', HttpStatus.NOT_FOUND, null, this.Userslogin+' not found');
      }

      if (dto.email && dto.email !== user.email) {
        const existing = await this.repository.findOne({ where: { email: dto.email } });
        if (existing && existing.id !== user.id) {
          this.logger.error(`[${date}] Update ${this.classModel} error: email already exists`);
          return ResponseHelper.error('Email already exists', HttpStatus.CONFLICT, null, 'Email already exists');
        }
        user.email = dto.email;
      }

      if (dto.phone && dto.phone !== user.phone) {
        const existing = await this.repository.findOne({ where: { phone: dto.phone } });
        if (existing && existing.id !== user.id) {
          this.logger.error(`[${date}] Update ${this.classModel} error: phone already exists`);
          return ResponseHelper.error('Email already exists', HttpStatus.CONFLICT, null, 'phone already exists');
        }
        user.phone = dto.phone;
      }

      if (dto.passwordHash) {
        user.passwordHash = await bcrypt.hash(dto.passwordHash, 10);
      }

      user.name = dto.name ?? user.name;
      user.phone = (dto.phone ?? user.phone) || null;
      user.role = dto.role ?? user.role;
      user.dateNaissance = dto.dateNaissance ? new Date(dto.dateNaissance) : user.dateNaissance;
      user.nom = (dto.nom ?? user.nom) || null;
      user.prenom = (dto.prenom ?? user.prenom) || null;
      user.job = (dto.job ?? user.job) || null;
      user.habitation = (dto.habitation ?? user.habitation) || null;

      const saved = await this.repository.save(user);
      const { passwordHash: _, ...safe } = saved as any;

      this.logger.log(`[${date}] Update ${this.Userslogin} success: ${safe.email}`);
      return ResponseHelper.success(safe, 'User updated');
    } catch (error) {
      this.logger.error(`[${date}] Update ${this.Userslogin} error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error updating '+this.Userslogin, HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }


  async delete(id: string): Promise<any> {
    const date = new Date().toISOString();
    try {
      const user = await this.repository.findOne({ where: { id } });
      if (!user) {
        this.logger.error(`[${date}] Delete ${this.classModel} error: ${this.classModel} not found: ${id}`);
        return ResponseHelper.error(this.classModel+' not found', HttpStatus.NOT_FOUND, null, this.classModel+' not found');
      }

      await this.repository.remove(user);

      this.logger.log(`[${date}] Delete ${this.classModel} success: ${user.email ?? id}`);
      return ResponseHelper.success(null, this.classModel+' deleted');
    } catch (error) {
      this.logger.error(`[${date}] Delete ${this.classModel} error: ${error.message}`, error.stack);
      return ResponseHelper.error('Error deleting '+this.classModel, HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
  }
  
  async userConnected(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                success: false,
                message: 'Token Signature could not be verified in authentication.',
                error: 'Token validation failed'
    });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      var user = await this.repository.findOne({ where: { id: decoded.sub } ,relations: ['orders.orderItems','payments',],});
      return user;
    } catch (e) {
      throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Token Signature could not be verified with authenticiation.',
          error: 'Token validation failed'
      });
    }
  }
}
