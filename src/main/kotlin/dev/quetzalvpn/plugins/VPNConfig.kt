package dev.quetzalvpn.plugins

import dev.quetzalvpn.openvpn.OpenVPNConfig
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.nio.file.Paths

fun Application.configureVPNConfigRouting() {
    val vpnConfigDir = Paths.get(environment.config.property("openvpn.config.path").getString());
    val vpnConfigFile = vpnConfigDir.resolve("openvpn.conf")

    val vpnConfig = OpenVPNConfig(vpnConfigFile)


    routing {
        route("/api/v1/vpn/config") {
            get {
                val config = vpnConfig.readConfigRaw()
                call.respondText(config)
            }
        }
    }

}