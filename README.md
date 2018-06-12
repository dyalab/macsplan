Scheduler website
//for local
download NodeJs

open up powershell & type in: npm install

run "runwebsite.bat"

go to: localhost:80

website is running in local server.

//for macsplan.mines.edu

make sure NodeJS library is installed

go to website directory

do "sudo npm install" if node modules folder is not there

check in loadCourses.js that all http requests to macsplan.mines.edu not localhost

to run website:
sudo node server.js

to stop website:
sudo node server.js


