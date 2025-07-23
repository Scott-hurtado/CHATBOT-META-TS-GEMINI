import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { chat } from './gemini'

const PORT = process.env.PORT ?? 3008

// Flujo principal que maneja todas las preguntas generales
const flowPreguntasGenerales = addKeyword<Provider, Database>(EVENTS.WELCOME)
    .addAnswer(
        '🤖Hola soy Maxibot preguntame lo que quieras, Respondere tus preguntas',
        { capture: true },
        async (ctx, { flowDynamic }) => {
            const prompt = "Eres un asistente virtual"
            const text = ctx.body
            
            try {
                const response = await chat(prompt, text)
                await flowDynamic(response)
            } catch (error) {
                console.error('Error processing message:', error)
                await flowDynamic('Lo siento, ocurrió un error al procesar tu mensaje. Intenta nuevamente.')
            }
        }
    )

const main = async () => {
    const adapterFlow = createFlow([flowPreguntasGenerales])
    const adapterProvider = createProvider(Provider, {
        jwtToken: process.env.META_JWT_TOKEN || 'your-jwt-token',
        numberId: process.env.META_NUMBER_ID || 'your-number-id',
        verifyToken: process.env.META_VERIFY_TOKEN || 'your-verify-token',
        version: 'v18.0'
    })
    const adapterDB = new Database()

    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    console.log('🤖 Maxibot iniciado correctamente')
    httpServer(+PORT)
}

main().catch(console.error)