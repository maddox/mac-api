var path = require('path')
var exec = require('child_process').exec
var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var parameterize = require('parameterize')

var config_dir = process.env.CONFIG_DIR || './config'
var config = require(config_dir + '/config.json')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

var logFormat = "'[:date[iso]] - :remote-addr - :method :url :status :response-time ms - :res[content-length]b'"
app.use(morgan(logFormat))

app.get('/_ping', function(req, res){
  res.send('OK')
})

app.get('/', function(req, res){
  res.sendfile('index.html');
})

app.post('/wake', function(req, res){
  exec("caffeinate -u -t 1", function(error, stdout, stderr){
    res.send('OK')
  })
})

app.post('/sleep_display', function(req, res){
  exec("pmset displaysleepnow", function(error, stdout, stderr){
    res.send('OK')
  })
})

app.listen(process.env.PORT || 8686)
