const express = require("express")
const path = require("path")
const app = express()
const port = 3000
const fs = require("fs")

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    if (files.length > 0) {
      let filedatas = []
      files.forEach((file) => {
        filepath = path.join(__dirname, 'files', file)
        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = data.split(":-:-:")
          filedatas.push({
            title: data[0],
            details: data[1]
          })
          if (filedatas.length === files.length) {
            console.log(filedatas)
            res.render('home', { url: req.protocol + "://" + req.headers.host, files: files, filedatas: filedatas })
          }
        })
      })
    } else {
      res.render('home', { url: req.protocol + "://" + req.headers.host, files: files })
    }
  })
})

app.get('/files/:name', (req, res) => {
  fs.readFile(`./files/${req.params.name.split(' ').join('')}.txt`, 'utf-8', (err, filedata) => {
    filedata = filedata.split(":-:-:")
    res.render('show', { url: req.protocol + "://" + req.headers.host, title: filedata[0], details: filedata[1] })
  })
})

app.get('/delete/:name', (req, res) => {
  fs.unlinkSync(`./files/${req.params.name.split(' ').join('')}.txt`)
  res.redirect("/")
})

app.post('/submit', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, `${req.body.title}:-:-:${req.body.detail}`, (err) => {
    console.log(err)
    res.redirect("/")
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})