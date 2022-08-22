
import { dirname, join, normalize, relative, resolve } from 'path';
import os, { arch, cpus, EOL, platform, userInfo } from 'os';
import { createInterface } from 'readline';
import { exit, stdin as input, stdout as output } from 'process';
import { createReadStream, createWriteStream, mkdir, readdir, rename, rm, unlink, unlinkSync } from 'fs';
import { pipeline } from 'stream';
import { createHash } from 'crypto';
import { createBrotliCompress } from 'zlib';

const rootDir = userInfo().homedir;
process.chdir(rootDir);

const cpuOverall = cpus().length;
const { model: cpuModel, speed: cpuSpeed } = cpus()[0];
const { homedir, username } = userInfo();

const user = {
  name: 'Anonym'
};

if (process.argv[2] && process.argv[2].startsWith('--username=')) {

  user.name = process.argv[2].split('--username=').join('') || user.name;
  console.log(`Welcome to the File Manager, ${user.name}`);
} else {
  throw new Error('Failed input');
}

const rl = createInterface({ input, output, prompt: '> ' });
try {
  output.write(`\nYour are currently in path ${process.cwd()}\n`);
  rl.prompt();

  rl.on('line', (input) => {

    if (input) {
      getCommand(input);
    } else {
      console.log('Failed input');
    };

    output.write(`\nYour are currently in path ${process.cwd()}\n`);
    rl.prompt();
  })

  rl.on('SIGINT', () => {

    rl.question('Are you sure want to exit? y(yes)/n(no)\n> ', (answer) => {

      answer === 'y' ? rl.close() & output.write(`Thank you for using File Manager, ${user.name}.\n`)
        : rl.prompt();
    });
  });

  const getCommand = (comLine) => {
    const com = comLine.trim().split(' ');

    switch (com[0]) {

      case 'up':
        try {
          process.chdir(relative(process.cwd(), '../'));
        } catch {
          console.log('Operation failed');
        };
        break;

      case 'cd':
        try {
          process.chdir(normalize(relative(process.cwd(), com[1])));
        } catch {
          console.log('Operation failed');
        };

        break;

      case 'ls':
        readdir(process.cwd(), (err, files) => {
          if (err) {
            console.log('Operation failed');
            rl.prompt();
          };
          files.forEach(item => {
            output.write(`\n${item}`);
          });
          rl.prompt();
        });
        break;

      case 'cat':

        const readSteam = createReadStream(resolve(process.cwd(), com[1]), 'utf8');
        readSteam.on('data', data => {
          console.log(data);
          rl.prompt();
        });

        readSteam.on('error', err => {
          console.log('Operation failed');
          rl.prompt();
        });

        break;
      case 'add':
        try {
          const writeStream = createWriteStream(relative(process.cwd(), com[1]));
          writeStream.end();

        } catch {
          console.log('Operation failed');
        };

        break;

      case 'rn':
        rename(com[1], com[2], err => {
          if (err) {
            console.log('Operation failed');
            rl.prompt();
          };
        });
        break;

      case 'cp':
        const soursPath1 = relative(process.cwd(), com[1]);
        const movePath1 = relative(com[2], com[1]);
        const readStream = createReadStream(soursPath1);
        const writeStream = createWriteStream(movePath1);
        pipeline(
          readStream,
          writeStream,
          err => {
            if (err) {
              console.log('Operation failed');
              rl.prompt();
            }
          }
        );
        break;

      case 'mv':
        try{
          const soursPath = relative(process.cwd(), com[1]);
          const movePath = relative(com[2], com[1]);
          const moveRS = createReadStream(soursPath);
          const moveWS = createWriteStream(movePath);
          moveRS.pipe(moveWS);
          moveRS.on('end', ()=>{
            unlinkSync(relative(process.cwd(), com[1]));
          });
        }catch{
          console.log('Operation failed');
        }
        break;

      case 'rm':
        rm(relative(process.cwd(), com[1]), { recursive: true }, (err) => {
          if (err) {
            console.log('Operation failed');
            rl.prompt();
          }
          rl.prompt();
        });

        break;

      case 'os':

        if(!com[1].startsWith('--')) console.log('Failed input');
        try {
          if (com[1] === '--EOL') {
            output.write(`${EOL}`);
          } else if (com[1] === '--cpus') {
            output.write(`Total number of processors: ${cpuOverall}.\nModel : ${cpuModel}.\nSpeed: ${cpuSpeed} GHz`);
          } else if (com[1] === '--homedir') {
            output.write(`${homedir}`);
          } else if (com[1] === '--username') {
            output.write(`${username}`);
          } else if (com[1] === '--architecture') {
            output.write(`${arch}`)
          };

        } catch {
          console.log('Operation failed');
        };

        break;

      case 'hash':
       try{

         const hashRS = createReadStream(resolve(process.cwd(), com[1]));
         hashRS.on('data', (data)=> {
           
         const fileToHash = createHash('SHA256').update(data.toString()).digest('hex');
         console.log(fileToHash);
         rl.prompt();
        });

       }catch{
        console.log('Operation failed');
       };

        break;

      case 'compress':
        try {
        const readFile = relative(process.cwd(), com[1]);
        const writeFile = relative(process.cwd(), com[2]);

       const zipRS = createReadStream(readFile);
       const zipWS = createWriteStream(writeFile);
       const zipFile = createBrotliCompress();
       zipRS.pipe(zipFile).pipe(zipWS);
       zipRS.on('error', err => {
        console.log('Operation Failed');
        rl.prompt();
       });
       zipWS.on('error', err => {
        console.log('Operation Failed');
        rl.prompt();
       });

        } catch {
          console.log('Operation Failed');
        rl.prompt();
        };
      
        break;

      case 'decompress':
        try {
          const readFile = relative(process.cwd(), com[1]);
          const writeFile = relative(process.cwd(), com[2]);
  
         const zipRS = createReadStream(readFile);
         const zipWS = createWriteStream(writeFile);
         const unzipFile = createBrotliCompress();
         zipRS.pipe(unzipFile).pipe(zipWS);
         zipRS.on('error', err => {
          console.log('Operation Failed');
          rl.prompt();
         });
         zipWS.on('error', err => {
          console.log('Operation Failed');
          rl.prompt();
         });
  
          } catch {
            console.log('Operation Failed');
             rl.prompt();
          };
        break;

      case '.exit':
        output.write(`Thank you for using File Manager, ${user.name}.`);
        rl.close();
        exit();
        break;

      default:
        console.log('Failed input');
        break;
    }
  };


} catch {
  console.log('Operation failed');
};

