# boilerplate-website-gulp

A boilerplate for creating websites/web apps with the help of task runners and optimization for best performance!

1. SCSS preprocessing to CSS
2. Combines custom CSS with additional CSS files to one
3. Minifies CSS file
4. Combile additional and custom JS files to one
5. Converts to ES5 using Babel
6. Minifies JS file
7. Takes img assets from src/assets and optimizes them and sends them to dist/assets/
8. Live Browser for continuous watch of file changes

### Important
All assets and files must be placed inside src folder and all all asset reference in html must be made to towards dist folder as optimized assets will be present there.


## Setup

Clone the repository. 

Go to terminal/command line and type:
```bash
'cd file_directory' 
'npm install'
```
add additional css/js files via npm modules and mention the directory in gulp.js file in vendors or include files in src/css or src/js directory

### Start Task Runner and Optimizer
In the terminal/command line type
```bash
'gulp' 
```
It will run continuously in the background and will refresh everytime changes are made.


## Output
Output/compiled css and js will be available in dist/ folder!

Happy Coding!!
