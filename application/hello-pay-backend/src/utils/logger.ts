import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

export class FileLogger extends Logger {
  private logPath: string;

  constructor(context: string) {
    super(context);
    this.logPath = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath, { recursive: true });
    }
  }

  private writeLog(message: string) {
    const date = new Date();
    const fileName = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}.log`;
    const timestamp = date.toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    fs.appendFileSync(path.join(this.logPath, fileName), logMessage);
  }

  log(message: string) {
    super.log(message);
    this.writeLog(`INFO: ${message}`);
  }

  error(message: string, trace?: string) {
    super.error(message, trace);
    this.writeLog(`ERROR: ${message}${trace ? `\nStack: ${trace}` : ''}`);
  }
}