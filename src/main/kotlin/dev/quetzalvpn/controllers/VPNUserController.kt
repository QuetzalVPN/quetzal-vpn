package dev.quetzalvpn.controllers

import dev.quetzalvpn.models.LoginUser
import dev.quetzalvpn.models.VPNUser
import org.jetbrains.exposed.sql.transactions.transaction

class VPNUserController {

    private fun activateUser(vpnUser: VPNUser) {
        TODO("Write user to OpenVPN")
    }

    private fun deactivateUser(vpnUser: VPNUser) {
        TODO("Remove user from OpenVPN")
    }

    fun addVPNUser(name: String, isEnabled: Boolean = true, createdBy: LoginUser): VPNUser {

        val newVPNUser = transaction {
            VPNUser.new {
                this.name = name
                this.isEnabled = isEnabled
                this.createdBy = createdBy
            }
        }

        if(isEnabled) {
            activateUser(newVPNUser)
        }

        return newVPNUser;
    }

    fun enableVPNUser(vpnUser: VPNUser) {
        transaction {
            vpnUser.isEnabled = true
        }
        activateUser(vpnUser)
    }

    fun disableVPNUser(vpnUser: VPNUser) {
        transaction {
            vpnUser.isEnabled = false
        }
        deactivateUser(vpnUser)
    }
}
