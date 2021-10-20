import cheerio from 'cheerio'
import axios from 'axios'
import express from 'express'

const app = express()
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
    const data = await axios.get('https://my.freshpoint.cz/device/product-list/58')
    const html = data.data
    const $ = cheerio.load(html)
    const menu = []
    $('.rounded-circle').each(function () {
        const item = this
        $(item).parent().parent().parent().find('.font-weight-bold').each(function () {
            const text = $(this).text().trim()
            if (text != 'Poslední kus!' && !text.toString().includes('kusy')) {
                console.log(text)
                menu.push(text)
            }
        })
    })
    res.render('index', { menu })
})

app.listen('80', () => console.log('Server listening...'))

