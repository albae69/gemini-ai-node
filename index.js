import dotenv from 'dotenv/config.js'
import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

const PORT = 3001 || process.env.PORT

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction:
    'You must answer these question with short answers, max 2 paragraph!',
})

app.get('/', (req, res) => res.send({ message: 'Test Gemini AI API' }))
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body ?? ''
    const result = await model.generateContent(message)
    const response = await result.response
    console.log(`response: ${JSON.stringify(response, null, 2)}`)
    const text = response.text()

    res.send({ success: true, message: text })
  } catch (error) {
    console.log('error : ', error)
    res.status(500).send({ success: false, message: 'Server Error!' })
  }
})

app.listen(PORT, () => console.log(`server listening on port : ${PORT}`))
