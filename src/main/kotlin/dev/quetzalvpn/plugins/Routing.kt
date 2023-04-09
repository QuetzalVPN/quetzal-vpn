package dev.quetzalvpn.plugins

import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.http.content.*

fun Application.configureRouting() {
    configureVPNUserRouting()


    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respondText(text = "500: $cause", status = HttpStatusCode.InternalServerError)
        }
    }
    routing {
        route("/api/v1") {
            route("/auth") {
                authenticate {
                    get("/me") {
                        call.respondText("Hello, ${call.principal<JWTPrincipal>()?.payload?.getClaim("username")}")
                    }
                }
            }

        }
    }
}
