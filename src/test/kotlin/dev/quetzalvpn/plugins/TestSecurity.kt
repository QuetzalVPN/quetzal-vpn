package dev.quetzalvpn.plugins

import dev.quetzalvpn.dao.DatabaseFactory
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals

class TestSecurity {
    @Test
    fun testRoot() = testApplication {
        application {
            DatabaseFactory.init(environment.config)
            configureSecurity()
        }

        client.post("/api/v1/auth/login") {
            setBody(LoginUserRequest("admin", "admin"))
        }.apply {
            val response =  body<LoginUserResponse>()
            assertEquals("admin", response.username)
            assertEquals(HttpStatusCode.OK, status)
        }

    }
}