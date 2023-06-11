package dev.quetzalvpn.plugins

import dev.quetzalvpn.openvpn.ClientConfig
import dev.quetzalvpn.openvpn.ServerConfig
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.nio.file.Paths


fun Application.configureVPNConfigRouting() {
    val configDir = Paths.get(environment.config.property("openvpn.config.path").getString());
    val serverConfigFile = configDir.resolve("server.conf")

    val serverConfig = ServerConfig(serverConfigFile);
    val clientConfig = ClientConfig(configDir.resolve("client-common.conf"))


    routing {
        route("/api/v1/vpn/config") {

            route("/server") {
                get {
                    serverConfig.readEntries()
                    call.respond(serverConfig.getParsed())
                }
                get("/raw") {
                    call.respondText(serverConfig.getRaw())
                }
            }
            route("/client") {
                get {
                    clientConfig.readEntries()
                    TODO("Client Config Parsing not implemented yet")
                }
                get("/raw") {
                    call.respondText(clientConfig.getRaw())
                }
            }
        }
    }

}