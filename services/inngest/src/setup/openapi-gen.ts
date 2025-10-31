import { createServer } from '@/server.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generateOpenAPI() {
    const fastify = createServer({ withLogger: false })

    await fastify.ready()

    // Get the OpenAPI schema
    const schema = fastify.swagger()

    const dirPath = path.join(__dirname, '../generated/openApi')
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }

    // Write it to a file
    const filePath = path.join(dirPath, '/openapi.json')
    fs.existsSync(filePath) && fs.unlinkSync(filePath)

    fs.writeFileSync(filePath, JSON.stringify(schema, null, 2))

    console.log('OpenAPI schema generated successfully!')

    // Close the app
    await fastify.close()
}

generateOpenAPI().catch(console.error)
