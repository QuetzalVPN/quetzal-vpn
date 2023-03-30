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




class VPNUserRoute {
    @Serializable
    data class CreateRequest(val username: String, val enable: Boolean?)

    @Serializable
    data class CreateResponse(val id: Int, val username: String, val isEnabled: Boolean)

    @Serializable
    data class GetResponse(val id: Int, val username: String, val isEnabled: Boolean)

    @Serializable
    data class GetAllResponse(val amount: Int, val amountDisabled: Int, val amountEnabled: Int,val vpnUsers: List<GetResponse>)

    @Serializable
    data class PatchRequest(val username: String? = null, val enable: Boolean? = null)
}
fun Application.configureVPNUserRouting(){

    val controller = VPNUserController()

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
                    val amountDisabled = vpnUsers.count { !it.isEnabled }

                    val response = VPNUserRoute.GetAllResponse(amount, amountDisabled, amountEnabled, vpnUsers)
                    call.respond(response)
                }
                post {
                    val principal = call.principal<JWTPrincipal>()?.payload;
                    val authUserId = principal?.getClaim("userid")?.asInt()

                    if(authUserId == null){
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

                    val newVPNUser = controller.addVPNUser(reqBody.username, reqBody.enable ?: true, loginUser)

                    val response = VPNUserRoute.CreateResponse(newVPNUser.id.value, newVPNUser.name, newVPNUser.isEnabled)
                    call.respond(HttpStatusCode.Created, response)
                }

                get("{id}"){
                    val id = call.parameters["id"]?.toIntOrNull()
                    if (id == null) {
                        call.respond(HttpStatusCode.BadRequest)
                        return@get
                    }

                    val vpnUser = transaction {
                        VPNUser.findById(id)
                    }
                    if (vpnUser == null) {
                        call.respond(HttpStatusCode.NotFound)
                        return@get
                    }

                    val response = VPNUserRoute.GetResponse(vpnUser.id.value, vpnUser.name, vpnUser.isEnabled)
                    call.respond(response)
                }
                patch("{id}") {
                    val id = call.parameters["id"]?.toIntOrNull()
                    if (id == null) {
                        call.respond(HttpStatusCode.BadRequest)
                        return@patch
                    }

                    val vpnUser = transaction {
                        VPNUser.findById(id)
                    }
                    if (vpnUser == null) {
                        call.respond(HttpStatusCode.NotFound)
                        return@patch
                    }

                    val reqBody = call.receive<VPNUserRoute.PatchRequest>()
                    transaction {
                        vpnUser.apply {
                            if (reqBody.username != null) name = reqBody.username
                            if (reqBody.enable != null) isEnabled = reqBody.enable
                        }
                    }

                    val response = VPNUserRoute.GetResponse(vpnUser.id.value, vpnUser.name, vpnUser.isEnabled)
                    call.respond(response)
                }
                delete("{id}"){
                    val id = call.parameters["id"]?.toIntOrNull()
                    if (id == null) {
                        call.respond(HttpStatusCode.BadRequest)
                        return@delete
                    }

                    val vpnUser = transaction {
                        VPNUser.findById(id)
                    }
                    if (vpnUser == null) {
                        call.respond(HttpStatusCode.NotFound)
                        return@delete
                    }

                    transaction {
                        vpnUser.delete()
                    }

                    call.respond(HttpStatusCode.NoContent)
                }

            }
        }
    }
}