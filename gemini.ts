import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function chat(prompt: string, text: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        
        const formatPrompt = 'eres un asistente virtual de maxiapoyo, las inscripciones de son el 12 de diciembre,en el habitat solidaridad 4 tenemos los cursos de maquillaje, sublimacion y mecanica, en altares hay reposteria panaderia y todos los cursos cuestan $400\n\n' + prompt + '\n\nEl input del usuario es el siguiente:' + text
        
        const result = await model.generateContent(formatPrompt)
        console.log(result) // Log para inspeccionar la respuesta
        
        const response = result.response
        
        if (response && response.text) {
            const answ = response.text()
            return answ
        } else {
            return "Lo siento, no pude procesar tu solicitud."
        }
    } catch (error) {
        console.error('Error in Gemini chat:', error)
        return "Lo siento, ocurrió un error al procesar tu solicitud."
    }
}