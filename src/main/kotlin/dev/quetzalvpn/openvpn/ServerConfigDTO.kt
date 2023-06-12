package dev.quetzalvpn.openvpn

import kotlinx.serialization.Serializable

enum class Protocol {
    TCP, UDP
}

@Serializable
data class RouteDefinition(
    val network: String,
    val subnetMask: String
)

// Maybe differentiate between specific options e.g. DNS
@Serializable
data class DHCPOption(
    val type: String,
    val param: String
)

@Serializable
data class KeepAliveDefinition(
    val interval: Int,
    val timeout: Int
)

@Serializable
data class LogDefinition(
    val append: Boolean,
    val fileName: String
)

@Serializable
data class ServerDefinition(
    val subnet: String,
    val mask: String
)

@Serializable
data class PushOptions(
    val routes: List<RouteDefinition>,
    val dhcpOptions: List<DHCPOption>,
    val redirectAll: Boolean

)

@Serializable
data class ServerConfigDTO(
    val port: Int,
    val proto: Protocol,
    val server: ServerDefinition,
    val poolPersist: String?,
    val clientToClient: Boolean,
    val duplicateCN: Boolean,
    val explicitExitNotify: Boolean,
    val keepAlive: KeepAliveDefinition?,
    val cipher: String?,
    val maxClients: Int?,
    val status: String?,
    val log: LogDefinition?,
    val verbosity: Int?,
    val pushOptions: PushOptions
)