import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

export class Helper {
    constructor(context: any) {

    }
    static generateHexSequence(length: number): string {
    let hexSequence = "";
    for (let i = 0; i < length; i++) {
      hexSequence += Math.floor(Math.random() * 16).toString(16);
    }
    return hexSequence;
    }
    
    static generateHexNumber(length: number): string {
      let number = "";
      for (let i = 0; i < length; i++) {
        let digit = Math.floor(Math.random() * 10);
        number += digit;
      }
      return number;
    }
}