package dev.quetzalvpn.plugins

import dev.quetzalvpn.controllers.VPNUserController
import dev.quetzalvpn.models.LoginUser
import dev.quetzalvpn.models.VPNUser
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.transactions.transaction


suspend fun ApplicationCall.getParamsVPNUser(): VPNUser? {
    val id = parameters["id"]?.toIntOrNull()
    if (id == null) {
        respond(HttpStatusCode.BadRequest)
        return null
    }

    val vpnUser = transaction {
        VPNUser.findById(id)
    }
    if (vpnUser == null) {
        respond(HttpStatusCode.NotFound)
    }
    return vpnUser
}

class VPNUserRoute {
    @Serializable
    data class CreateRequest(val username: String, val enable: Boolean? = null)

    @Serializable
    data class CreateResponse(val id: Int, val username: String, val isEnabled: Boolean)

    @Serializable
    data class GetResponse(val id: Int, val username: String, val isEnabled: Boolean)

    @Serializable
    data class GetAllResponse(
        val amount: Int,
        val amountDisabled: Int,
        val amountEnabled: Int,
        val vpnUsers: List<GetResponse>
    )

    @Serializable
    data class PatchRequest(val enable: Boolean? = null)
}

fun Application.configureVPNUserRouting() {

    val controller = VPNUserController(environment.config)

    routing {
        authenticate {
            route("/api/v1/vpn/users") {

                get {

                    val vpnUsers = transaction {
                        VPNUser.all().map {
                            VPNUserRoute.GetResponse(it.id.value, it.name, it.isEnabled)
                        }
                    }

                    val amount = vpnUsers.size
                    val amountEnabled = vpnUsers.count { it.isEnabled }
                    val amountDisabled = amount - amountEnabled

                    val response = VPNUserRoute.GetAllResponse(amount, amountDisabled, amountEnabled, vpnUsers)
                    call.respond(response)
                }
                post {
                    val principal = call.principal<JWTPrincipal>()?.payload
                    val authUserId = principal?.getClaim("userid")?.asInt()

                    if (authUserId == null) {
                        call.respond(HttpStatusCode.Unauthorized)
                        return@post
                    }

                    val loginUser = transaction {
                        LoginUser.findById(authUserId)
                    }
                    if (loginUser == null) {
                        call.respond(HttpStatusCode.Unauthorized)
                        return@post
                    }

                    val reqBody = call.receive<VPNUserRoute.CreateRequest>()

                    if (!reqBody.username.matches(Regex("[a-zA-Z0-9_-]{3,32}"))) {
                        call.respond(HttpStatusCode.BadRequest, "Bad username")
                        return@post
                    }


                    val newVPNUser = controller.addVPNUser(reqBody.username, loginUser).also {
                        if (reqBody.enable == false) {
                            controller.disableVPNUser(it)
                        }
                    }
                    val response =
                        VPNUserRoute.CreateResponse(newVPNUser.id.value, newVPNUser.name, newVPNUser.isEnabled)
                    call.respond(HttpStatusCode.Created, response)
                }

                route("{id}") {
                    get {
                        val vpnUser = call.getParamsVPNUser() ?: return@get

                        val response = VPNUserRoute.GetResponse(vpnUser.id.value, vpnUser.name, vpnUser.isEnabled)
                        call.respond(response)
                    }
                    patch {
                        val vpnUser = call.getParamsVPNUser() ?: return@patch

                        val reqBody = call.receive<VPNUserRoute.PatchRequest>()

                        if (reqBody.enable != null) {
                            if (reqBody.enable != vpnUser.isEnabled) {
                                if (reqBody.enable) {
                                    call.application.environment.log.info("Enabling VPN user ${vpnUser.name}")
                                    controller.enableVPNUser(vpnUser)
                                } else {
                                    controller.disableVPNUser(vpnUser)
                                }
                            }
                        }

                        val response = VPNUserRoute.GetResponse(vpnUser.id.value, vpnUser.name, vpnUser.isEnabled)
                        call.respond(response)
                    }
                    delete {
                        val vpnUser = call.getParamsVPNUser() ?: return@delete

                        transaction {
                            vpnUser.delete()
                        }

                        call.respond(HttpStatusCode.NoContent)
                    }

                    get("/profile") {
                        val vpnUser = call.getParamsVPNUser() ?: return@get

                        val cert = controller.getVPNUserConfig(vpnUser)

                        call.respondFile(cert)
                    }
                }


            }
        }
    }
}