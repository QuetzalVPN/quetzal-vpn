package dev.quetzalvpn.openvpn

import kotlinx.serialization.Serializable

@Serializable
data class RemoteDefinition(
    val host: String,
    val port: Int
)

@Serializable
data class ClientConfigDTO(
    val remote: RemoteDefinition,
    val proto: Protocol,
    val cipher: String?
)