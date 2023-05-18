package dev.quetzalvpn.plugins

import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*

fun Application.configureReactSPA() {
    val frontendBuildPath =  environment.config.property("frontend.buildPath").getString()
    routing {
        singlePageApplication {
            filesPath = frontendBuildPath
            defaultPage = "index.html"
            useResources = false
        }
    }
}