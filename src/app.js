import 'dotenv/config';
import express from 'express';
import path from 'path';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import cors from 'cors'

class App {

  constructor() {
    this.server = express();

    this.server.use(async (req, res) => {
      console.log(chalk.yellow('Received request:', req.url));
    
      const url = req.url === '/' ? 'index.html' : req.url;
    
      if (url.startsWith('/cdn/')) {
        return serveFile(res, path.join(packageFolder, url.replace(/^\/cdn\/([^\/]+)/, '$1/dist')));
      }
    
      serveFile(res, path.join(baseFolder, url), indexHtml);
    });
  }
  
  async serveFile(res, file, fallback) {
    try {
      console.log(chalk.blue('Trying '), file);
      const stat = await fs.stat(file);
      if (stat.isFile()) {
        console.log(chalk.green('Serving '), file);
        return res.sendFile(file);
      }
    } catch (error) {
      if (fallback) {
        console.log(chalk.red('404 Fallback'), 'Serving `index.html`');
        return res.sendFile(fallback);
      } else {
        console.log(chalk.red.bold('404 Not Found'));
        res.sendStatus(404);
      }
    }
  }
}

export default new App().server;