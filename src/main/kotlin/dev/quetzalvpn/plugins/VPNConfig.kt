package dev.quetzalvpn.plugins

import dev.quetzalvpn.openvpn.ClientConfig
import dev.quetzalvpn.openvpn.ClientConfigDTO
import dev.quetzalvpn.openvpn.ServerConfig
import dev.quetzalvpn.openvpn.ServerConfigDTO
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
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

                /* Controlled editing */
                get {
                    serverConfig.readEntries()
                    call.respond(serverConfig.getParsed())
                }
                post {
                    val newConfig = call.receive<ServerConfigDTO>()

                    serverConfig.writeParsed(newConfig)
                    call.respond(HttpStatusCode.Accepted)
                }

                /* Raw editing */
                get("/raw") {
                    call.respondText(serverConfig.getRaw())
                }
                post("/raw") {
                    val newConfigText = call.receiveText()
                    serverConfig.setRaw(newConfigText)
                    call.respond(HttpStatusCode.Accepted)
                }
            }
            route("/client") {

                /* Controlled editing */
                get {
                    clientConfig.readEntries()

                    call.respond(clientConfig.getParsed())
                }
                post {
                    val newConfig = call.receive<ClientConfigDTO>()

                    clientConfig.writeParsed(newConfig)
                    call.respond(HttpStatusCode.Accepted)
                }

                /* Raw editing */
                get("/raw") {
                    call.respondText(clientConfig.getRaw())
                }
                post("/raw") {
                    val newConfigText = call.receiveText()
                    clientConfig.setRaw(newConfigText)
                    call.respond(HttpStatusCode.Accepted)
                }
            }
        }
    }

}