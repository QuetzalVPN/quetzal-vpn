package dev.quetzalvpn

import dev.quetzalvpn.dao.DatabaseFactory
import io.ktor.server.application.*
import dev.quetzalvpn.plugins.*

fun main(args: Array<String>): Unit =
    io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // application.conf references the main function. This annotation prevents the IDE from marking it as unused.
fun Application.module() {
    DatabaseFactory.init(environment.config)
    configureSerialization()
    configureSecurity()
    configureRouting()
    configureReactSPA()
}
