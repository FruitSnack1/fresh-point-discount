import cheerio from 'cheerio'
import axios from 'axios'
import express from 'express'

const app = express()
app.use(express.static('public'))

app.get('/', async (req, res) => {
    const data = await axios.get('https://my.freshpoint.cz/device/product-list/58')
    const html = data.data
    const $ = cheerio.load(html)
    const menu = []
    const prices = []
    const images = []
    $('.rounded-circle').each(function () {
        const item = this
        let i = 0

        $(item).parent().parent().parent().find('.text-danger').each(function (i, e) {
            const text = $(this).text().trim()
            prices.push(text)
        })

        $(item).parent().parent().parent().find('img').each(function (i, e) {
            const src = $(this).attr('src')
            if (src[0] != '/')
                images.push(src)
        })
        $(item).parent().parent().parent().find('.font-weight-bold').each(function () {
            const text = $(this).text().trim()
            if (text != 'Poslední kus!' && !text.toString().includes('kusy')) {
                if (i % 2 == 0)
                    menu.push({ name: text })
                else
                    menu[menu.length - 1].discount = text
            }
            i++
        })
        for (let i = 0; i < menu.length; i++) {
            menu[i].price = prices[i]
            menu[i].img = images[i]
        }
    })
    res.json(menu)
    // res.json([
    //     {
    //         price: '59.90',
    //         name: 'karel',
    //         discount: '29.90',
    //         img: 'https://i.imgur.com/UOnlKZz.jpeg',
    //     },
    //     {
    //         price: '99.90',
    //         name: 'karel',
    //         discount: '59.90',
    //         img: 'https://i.imgur.com/UOnlKZz.jpeg',
    //     },
    //     {
    //         price: '79.90',
    //         name: 'karel',
    //         discount: '39.90',
    //         img: 'https://i.imgur.com/UOnlKZz.jpeg',
    //     },
    //     {
    //         price: '79.90',
    //         name: 'karel',
    //         discount: '39.90',
    //         img: 'https://i.imgur.com/UOnlKZz.jpeg',
    //     },
    //     {
    //         price: '79.90',
    //         name: 'karel',
    //         discount: '39.90',
    //         img: 'https://i.imgur.com/UOnlKZz.jpeg',
    //     },
    // ])
})

app.listen('8080', () => console.log('Server listening...'))

