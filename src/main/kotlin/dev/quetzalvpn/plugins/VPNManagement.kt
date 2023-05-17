package dev.quetzalvpn.plugins

import dev.quetzalvpn.openvpn.OpenVPNConfig
import dev.quetzalvpn.openvpn.OpenVPNManagementClient
import io.ktor.server.application.*
import io.ktor.server.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import java.nio.file.Paths

class VPNManagementRoute {
    @Serializable
    data class StatusResponse(val lastUpdated: String, val rawStatus: String)
}

fun Application.configureVPNManagementRouting() {
    val vpnServerHost = environment.config.property("openvpn.server.host").getString();
    val vpnServerManagementPort = environment.config.property("openvpn.server.managementPort").getString().toInt();


    val vpnManagementClient = OpenVPNManagementClient(vpnServerHost, vpnServerManagementPort)

    routing {
        route("/api/v1/vpn/management") {
            get("/status") {
                val status = vpnManagementClient.status()
                //call.respondText(status.rawStatus)
                //call.respond(VPNManagementRoute.StatusResponse(status.updated.toHttpDateString(), rawStatus = status.rawStatus))
                call.respond(status)
            }
        }
    }

}