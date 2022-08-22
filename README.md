## fileManagerNodeJs
Assignment: https://github.com/AlreadyBored/nodejs-assignments/tree/main/assignments/file-manager

Deadline date: 12.06.2022.

Done: 
- The program is started by npm-script start in following way:
```bash
npm run start -- --username=your_username
```
- General **total: 16**
    -**+6** Application accepts username and prints proper message
    -**+10** Application exits if user pressed `ctrl+c` or sent `.exit` command and proper message is printed
- Operations fail **total: 10**
    - **+10** Operation fail doesn't crash application
- Navigation & working directory operations implemented properly **total: 30**
    - **+10** Go upper from current directory
    - **+10** Go to dedicated folder from current directory
    - **+10** List all files and folders in current directory
- Basic operations with files implemented properly **total: 60**
    - **+10** Read file and print it's content in console
    - **+10** Create empty file
    - **+10** Rename file
    - **+10** Copy file (E:\folder)
    - **+10** Move file (E:\folder)
    - **+10** Delete file
- Operating system info (prints following information in console) implemented properly **total: 28**
    - **+10** Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them)
    - **+6** Get home directory
    - **+6** Get current *system user name* (Do not confuse with the username that is set when the application starts)
    - **+6** Get CPU architecture for which Node.js binary has compiled
- Hash calculation implemented properly **total: 20**
    - **+20** Calculate hash for file 
- Compress and decompress operations **total: 40**
    - **+20** Compress file (using Brotli algorithm)
    - **+20** Decompress file (using Brotli algorithm)

## Advanced Scope **total: 70**

- **+50** All files operations with reading/writing should be performed using Streams API
- **+20** Codebase is written in ESM modules instead of CommonJS

## Forfeits

- **-95% of total task score** Any external tools/libraries are used
- **-30% of total task score** Commits after deadline (except commits that affect only `Readme.md`, `.gitignore`, etc.)

## Total score: 274.