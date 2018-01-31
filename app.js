var path = require('path')
var exec = require('child_process').exec
var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var parameterize = require('parameterize')

var config_dir = process.env.CONFIG_DIR || './config'
var config = require(config_dir + '/config.json')

var brightness = path.resolve(__dirname, 'bin', 'brightness')
var volume = path.resolve(__dirname, 'bin', 'volume')
var audiodevice = path.resolve(__dirname, 'bin', 'audiodevice')
var dnd = path.resolve(__dirname, 'bin', 'dnd')
var netflix = path.resolve(__dirname, 'bin', 'netflix')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

var logFormat = "'[:date[iso]] - :remote-addr - :method :url :status :response-time ms - :res[content-length]b'"
app.use(morgan(logFormat))

app.get('/_ping', function(req, res){
  res.send('OK')
})

app.get('/', function(req, res){
  res.sendfile('index.html')
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

app.post('/brightness/:level', function(req, res){
  level = req.params.level
  exec(`${brightness} ${level}`, function(error, stdout, stderr){
    res.send('OK')
  })
})

app.post('/volume/:level', function(req, res){
  level = req.params.level
  exec(`${volume} ${level}`, function(error, stdout, stderr){
    res.send('OK')
  })
})

app.post('/dnd/:state', function(req, res){
  state = req.params.state
  exec(`${dnd} ${state}`, function(error, stdout, stderr){
    res.send('OK')
  })
})

app.post('/audiodevice/:port/:device', function(req, res){
  port = req.params.port
  device = req.params.device
  exec(`${audiodevice} ${port} "${device}"`, function(error, stdout, stderr){
    res.send('OK')
  })
})


app.post('/netflix/:command', function(req, res){
  command = req.params.command
  exec(`${netflix} "${command}"`, function(error, stdout, stderr){
    res.send('OK')
  })
})
app.get('/netflix', function(req, res){
  exec(`${netflix} get`, function(error, stdout, stderr){
    res.send(stdout)
  })
})



app.listen(process.env.PORT || 8686)
