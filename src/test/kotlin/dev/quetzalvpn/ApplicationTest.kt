package dev.quetzalvpn

import dev.quetzalvpn.dao.DatabaseFactory
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.server.testing.*
import kotlin.test.*
import io.ktor.http.*
import dev.quetzalvpn.plugins.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            DatabaseFactory.init(environment.config)
            configureSerialization()
            configureSecurity()
            configureRouting()
        }
        client.get("/").apply {
            assertEquals(HttpStatusCode.OK, status)
            assertEquals("Hello World!", bodyAsText())
        }
    }
}
