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
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respondText(text = "500: $cause", status = HttpStatusCode.InternalServerError)
        }
    }
    routing {
        singlePageApplication {
            useResources = true
            filesPath = "frontend"
            defaultPage = "index.html"
            ignoreFiles { it.endsWith(".txt") }
        }
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
