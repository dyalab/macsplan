Scheduler website
//for local
download NodeJs

open up powershell & type in: npm install

run "runwebsite.bat"

go to: localhost:80

website is running in local server.

//for macsplan.mines.edu

make sure NodeJS and "forever" library is installed

go to website directory

check in loadCourses.js that all http requests to macsplan.mines.edu not localhost

to run website:
sudo forever start server.js

to stop website:
sudo forever stop server.js


