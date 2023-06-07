package dev.quetzalvpn.plugins

import dev.quetzalvpn.models.LoginLog
import dev.quetzalvpn.models.LoginLogs
import dev.quetzalvpn.models.LoginUser
import dev.quetzalvpn.models.LoginUsers
import dev.quetzalvpn.security.Hashing
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

suspend fun ApplicationCall.getParamsAuthUser(): LoginUser? {
    val id = parameters["id"]?.toIntOrNull()
    if (id == null) {
        respond(HttpStatusCode.BadRequest)
        return null
    }

    val loginUser = transaction {
        LoginUser.findById(id)
    }
    if (loginUser == null) {
        respond(HttpStatusCode.NotFound)
    }
    return loginUser
}


@Serializable
data class PatchLoginUserRequest(val password: String)

@Serializable
data class SafeLoginUser(val username: String, val id: Int)

@Serializable
data class LoginLogResponse(
    val id: Int,
    @Serializable(with = LocalDateTimeSerializer::class) val dateTime: LocalDateTime,
    val origin: String,
    val successful: Boolean,
    val userId: Int
)

@Serializable
data class GetLogsResponse(val logs: List<LoginLogResponse>)

fun Application.configureLoginUsers() {

    val hashSecret = environment.config.property("login.hashSecret").getString()
    val hashing = Hashing(hashSecret)

    routing {

        authenticate {
            route("/api/v1/auth/users") {
                get {
                    val users = transaction {
                        LoginUser.all().toList()
                    }
                    val safeUsers = users.map { SafeLoginUser(it.loginName, it.id.value) }

                    call.respond(safeUsers)
                }

                post {
                    val loginUser = call.receive<LoginUserRequest>()

                    val userExists = transaction {
                        LoginUser.find {
                            LoginUsers.loginName eq loginUser.username.lowercase()
                        }.empty().not()
                    }

                    if (userExists) {
                        call.respond(HttpStatusCode.Conflict)
                        return@post
                    }

                    transaction {
                        LoginUser.new {
                            loginName = loginUser.username.lowercase()
                            passwordHash = hashing.generateHash(loginUser.password)
                        }
                    }

                    call.respond(HttpStatusCode.Created)
                }
                route("{id}") {
                    patch {
                        val loginUser = call.getParamsAuthUser() ?: return@patch
                        val patchValues = call.receive<PatchLoginUserRequest>()

                        transaction { loginUser.passwordHash = hashing.generateHash(patchValues.password) }
                        call.respond(HttpStatusCode.NoContent)
                    }
                    delete {
                        val loginUser = call.getParamsAuthUser() ?: return@delete

                        val userCount = transaction {
                            LoginUser.count()
                        }
                        if (userCount == 1L) {
                            call.respond(HttpStatusCode.Forbidden)
                            return@delete
                        }

                        transaction { loginUser.delete() }
                        call.respond(HttpStatusCode.NoContent)
                    }

                    route("logs") {
                        get {
                            val loginUser = call.getParamsAuthUser() ?: return@get
                            val logs = transaction {
                                LoginLog.find { LoginLogs.loginUserId eq loginUser.id }.toList()
                            }
                            call.respond(GetLogsResponse(logs.map {
                                LoginLogResponse(
                                    it.id.value,
                                    it.loginDateTime,
                                    it.loginIp,
                                    it.loginResult,
                                    it.loginUser.id.value
                                )
                            }))
                        }
                    }
                }
            }

        }
    }
}