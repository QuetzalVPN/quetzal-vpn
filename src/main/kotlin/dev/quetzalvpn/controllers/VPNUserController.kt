package dev.quetzalvpn.controllers

import dev.quetzalvpn.models.LoginUser
import dev.quetzalvpn.models.VPNUser
import dev.quetzalvpn.openvpn.EasyRSA
import io.ktor.server.config.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.nio.file.Path

class VPNUserController (private val config: ApplicationConfig){

    private val easyRSA = EasyRSA(
            binDir = Path.of(config.property("openvpn.easyrsa.binPath").getString()),
            pkiDir = Path.of(config.property("openvpn.easyrsa.pkiPath").getString()),
            configDir = Path.of(config.property("openvpn.config.path").getString())
        )

    private fun activateUser(vpnUser: VPNUser) {
        TODO("Write user to OpenVPN")
    }

    private fun deactivateUser(vpnUser: VPNUser) {
        TODO("Remove user from OpenVPN")
    }

    private fun generateUserCertificate(vpnUser: VPNUser) {
        easyRSA.buildClientFull(vpnUser.name)
    }

    fun addVPNUser(name: String, isEnabled: Boolean = true, createdBy: LoginUser): VPNUser {

        val newVPNUser = transaction {
            VPNUser.new {
                this.name = name
                this.isEnabled = isEnabled
                this.createdBy = createdBy
            }
        }
        generateUserCertificate(newVPNUser)

        if(isEnabled) {
            activateUser(newVPNUser)
        }

        return newVPNUser;
    }

    fun enableVPNUser(vpnUser: VPNUser) {
        activateUser(vpnUser)
        transaction {
            vpnUser.isEnabled = true
        }
    }

    fun disableVPNUser(vpnUser: VPNUser) {
        deactivateUser(vpnUser)
        transaction {
            vpnUser.isEnabled = false
        }
    }

    fun getVPNUserConfig(vpnUser: VPNUser): String {
        return easyRSA.getClientConfig(vpnUser.name)
    }
}
