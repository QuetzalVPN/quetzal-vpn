package dev.quetzalvpn.plugins

import dev.quetzalvpn.openvpn.OpenVPNManagementClient
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*


fun Application.configureVPNManagementRouting() {
    val vpnServerHost = environment.config.property("openvpn.server.host").getString();
    val vpnServerManagementPort = environment.config.property("openvpn.server.managementPort").getString().toInt();


    val vpnManagementClient = OpenVPNManagementClient(vpnServerHost, vpnServerManagementPort)

    routing {
        route("/api/v1/vpn/management") {
            get("/status") {
                val status = vpnManagementClient.status()

                call.respond(status)
            }
            post("/restart") {
                vpnManagementClient.restartServer()
                call.respond(HttpStatusCode.Accepted)
            }
            post("/kill/{clientId}") {
                val vpnUser = call.getParamsVPNUser("clientId") ?: return@post

                vpnManagementClient.killClient(vpnUser.name)
                call.respond(HttpStatusCode.Accepted)
            }

        }
    }

}