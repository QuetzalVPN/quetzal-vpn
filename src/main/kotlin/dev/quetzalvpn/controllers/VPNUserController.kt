package dev.quetzalvpn.controllers

import dev.quetzalvpn.models.LoginUser
import dev.quetzalvpn.models.VPNUser
import dev.quetzalvpn.openvpn.EasyRSA
import io.ktor.server.config.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File
import java.nio.file.Path

class VPNUserController (private val config: ApplicationConfig){

    private val easyRSA = EasyRSA(
            binDir = Path.of(config.property("openvpn.easyrsa.binPath").getString()),
            pkiDir = Path.of(config.property("openvpn.easyrsa.pkiPath").getString()),
            configDir = Path.of(config.property("openvpn.config.path").getString())
        )

    private fun activateUser(vpnUser: VPNUser) {
        TODO("Write user to OpenVPN")
        // move revoked files to active directories and reload crl
    }

    private fun deactivateUser(vpnUser: VPNUser) {
        easyRSA.revokeClient(vpnUser.name)
    }

    private fun generateUserCertificate(vpnUser: VPNUser) {
        easyRSA.buildClientFull(vpnUser.name)
    }

    fun addVPNUser(name: String, createdBy: LoginUser): VPNUser {

        val newVPNUser = transaction {
            VPNUser.new {
                this.name = name
                this.isEnabled = true
                this.createdBy = createdBy
            }
        }
        generateUserCertificate(newVPNUser)

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

    fun getVPNUserConfig(vpnUser: VPNUser): File {
        return easyRSA.getClientConfig(vpnUser.name)
    }
}
