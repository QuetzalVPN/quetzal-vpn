package dev.quetzalvpn.plugins

import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import dev.quetzalvpn.models.LoginLog
import dev.quetzalvpn.models.LoginUser
import dev.quetzalvpn.models.LoginUsers
import dev.quetzalvpn.security.generateHash
import dev.quetzalvpn.security.validatePassword
import io.ktor.http.*
import io.ktor.http.auth.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime
import java.util.*

@Serializable
data class LoginUserRequest(val username: String, val password: String)

@Serializable
data class LoginUserResponse(val username: String, val accessToken: String)

@Serializable
data class PatchLoginUserRequest(val password: String)

@Serializable
data class DeleteLoginUserRequest(val username: String)

@Serializable
data class SafeLoginUser(val username: String, val id: Int)


fun Application.configureSecurity() {
    val secret = environment.config.property("jwt.secret").getString()
    val issuer = environment.config.property("jwt.issuer").getString()
    val audience = environment.config.property("jwt.audience").getString()
    val myRealm = environment.config.property("jwt.realm").getString()
    val expirationTime = environment.config.property("jwt.expirationTimeSecs").getString().toLong() * 1000



    transaction {
        if (LoginUser.count() == 0L) {
            val adminUser = environment.config.property("login.admin.username").getString()
            val adminPassword = environment.config.property("login.admin.password").getString()
            log.info("Creating default user $adminUser")
            LoginUser.new {
                loginName = adminUser
                passwordHash = generateHash(adminPassword)
            }
        }
    }

    authentication {
        jwt {
            realm = myRealm

            authHeader { call ->
                val oldHeader = call.request.parseAuthorizationHeader();

                val tokenCookie = call.request.cookies.get(name = "token");

                tokenCookie?.let {
                    HttpAuthHeader.Single(oldHeader?.authScheme ?: "Bearer", tokenCookie)
                } ?: oldHeader;
            }

            verifier(JWT.require(Algorithm.HMAC256(secret)).withAudience(audience).withIssuer(issuer).build())
            validate { credential ->
                if (credential.payload.getClaim("username").asString() != "") {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }

            challenge { _, _ ->
                call.respond(HttpStatusCode.Unauthorized, "Token is invalid or has expired")
            }
        }
    }
    routing {
        route("/api/v1/auth") {
            post("/login") {

                val requestUser = call.receive<LoginUserRequest>()

                val userList = transaction {
                    LoginUser.find {
                        LoginUsers.loginName eq requestUser.username.lowercase()
                    }.toList()
                }

                if (userList.count() != 1) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@post
                }
                val user = userList.elementAt(0)

                if (!validatePassword(requestUser.password, user.passwordHash)) {
                    transaction {
                        LoginLog.new {
                            loginDateTime = LocalDateTime.now()
                            loginUser = user
                            loginIp = call.request.origin.remoteHost
                            loginResult = false
                        }
                    }
                    call.respond(HttpStatusCode.Unauthorized)
                    return@post
                }

                transaction {
                    LoginLog.new {
                        loginDateTime = LocalDateTime.now()
                        loginUser = user
                        loginIp = call.request.origin.remoteHost
                        loginResult = true
                    }
                }

                val token = JWT.create().withAudience(audience).withIssuer(issuer).withClaim("username", user.loginName)
                    .withClaim("userid", user.id.value).withExpiresAt(Date(System.currentTimeMillis() + expirationTime))
                    .sign(Algorithm.HMAC256(secret))
                val response = LoginUserResponse(user.loginName, token)
                // For non development set secure to true
                call.response.cookies.append(
                    "token",
                    token,
                    maxAge = expirationTime,
                    httpOnly = true,
                    secure = false,
                    extensions = mapOf("SameSite" to "strict")
                );
                call.respond(response)
            }

            authenticate {
                route("/signup") {
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
                                passwordHash = generateHash(loginUser.password)
                            }
                        }

                        call.respond(HttpStatusCode.Created)
                    }
                    patch {
                        val patchValues = call.receive<PatchLoginUserRequest>()
                        val userName = call.principal<JWTPrincipal>()?.payload?.getClaim("username")?.asString()
                        if (userName == null) {
                            call.respond(HttpStatusCode.Unauthorized)
                            return@patch
                        }

                        val dbUser = transaction {
                            LoginUser.find {
                                LoginUsers.loginName eq userName
                            }.firstOrNull()
                        }
                        if (dbUser == null) {
                            call.respond(HttpStatusCode.Unauthorized)
                            return@patch
                        }

                        transaction { dbUser.passwordHash = generateHash(patchValues.password) }
                        call.respond(HttpStatusCode.NoContent)
                    }
                    delete {
                        val deleteUser = call.receive<DeleteLoginUserRequest>()

                        val userAmount = transaction {
                            LoginUser.count()
                        }

                        if (userAmount <= 1L) {
                            call.respond(HttpStatusCode.Forbidden)
                            return@delete
                        }

                        val dbUser = transaction {
                            LoginUser.find {
                                LoginUsers.loginName eq deleteUser.username.lowercase()
                            }.firstOrNull()
                        }
                        if (dbUser == null) {
                            call.respond(HttpStatusCode.NotFound)
                            return@delete
                        }

                        transaction { dbUser.delete() }
                        call.respond(HttpStatusCode.NoContent)
                    }
                }
            }

        }

    }

}
