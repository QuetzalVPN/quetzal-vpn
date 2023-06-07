package dev.quetzalvpn.plugins

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import dev.quetzalvpn.models.LoginLog
import dev.quetzalvpn.models.LoginUser
import dev.quetzalvpn.models.LoginUsers
import dev.quetzalvpn.security.Hashing
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
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

fun Application.configureSecurity() {
    val secret = environment.config.property("jwt.secret").getString()
    val issuer = environment.config.property("jwt.issuer").getString()
    val audience = environment.config.property("jwt.audience").getString()
    val myRealm = environment.config.property("jwt.realm").getString()
    val expirationTime = environment.config.property("jwt.expirationTimeSecs").getString().toLong() * 1000
    val hashSecret = environment.config.property("login.hashSecret").getString()

    val hashing = Hashing(hashSecret)


    transaction {
        if (LoginUser.count() == 0L) {
            val adminUser = environment.config.property("login.admin.username").getString()
            val adminPassword = environment.config.property("login.admin.password").getString()
            log.info("Creating default user $adminUser")
            LoginUser.new {
                loginName = adminUser
                passwordHash = hashing.generateHash(adminPassword)
            }
        }
    }

    authentication {
        jwt {
            realm = myRealm

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

                if (!hashing.validatePassword(requestUser.password, user.passwordHash)) {
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
                call.respond(response)
            }
        }
    }
}
