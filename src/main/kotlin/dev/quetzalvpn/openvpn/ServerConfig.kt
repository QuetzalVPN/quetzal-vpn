package dev.quetzalvpn.openvpn

import kotlinx.serialization.Serializable
import java.nio.file.Path

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
data class ParsedServerConfig(
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

class ServerConfig(filePath: Path) : LineFile<List<String>>(filePath) {

    init {
        readEntries()
    }

    val pushEntries: List<List<String>>
        get() = currentEntries
            .filter { it[0] == "push" }
            .map {
                it[1]
                    .removeSurrounding("\"")
                    .split(" ")
            }


    override fun readEntries() =
        getLines()
            .map(Companion::splitStringOnSpace).toMutableList()
            .let { this.currentEntries = it }


    override fun writeEntries() =
        this.currentEntries
            .map { it.joinToString(" ") }
            .let { writeLines(it) }


    fun getParsed(): ParsedServerConfig = ParsedServerConfig(
        port = getPort(),
        proto = getProto(),
        server = getServer(),
        poolPersist = getPoolPersist(),
        clientToClient = getClientToClient(),
        duplicateCN = getDuplicateCN(),
        explicitExitNotify = getExplicitExitNotify(),
        keepAlive = getKeepAlive(),
        cipher = getCipher(),
        maxClients = getMaxClients(),
        status = getStatus(),
        log = getLog(),
        verbosity = getVerbosity(),
        pushOptions = getPushOptions()
    )

    fun getDuplicateCN(): Boolean = findEntry("duplicate-cn") != null
    fun getExplicitExitNotify(): Boolean = findEntry("explicit-exit-notify") != null
    fun getKeepAlive(): KeepAliveDefinition? = findEntry("keep-alive")?.let {
        KeepAliveDefinition(
            interval = it[1].toInt(),
            timeout = it[2].toInt()
        )
    }

    fun getCipher(): String? =
        findEntry("cipher")?.get(1)

    fun getMaxClients(): Int? = findEntry("max-clients")?.get(1)?.toInt()
    fun getStatus(): String? = findEntry("status")?.get(1)
    fun getLog(): LogDefinition? {
        val appendEntry = findEntry("log-append")
        val truncateEntry = findEntry("log")

        return if (appendEntry != null) {
            LogDefinition(true, appendEntry[1])
        } else if (truncateEntry != null) {
            LogDefinition(false, truncateEntry[1])
        } else {
            null
        }
    }

    fun getVerbosity(): Int? = findEntry("verb")?.get(1)?.toInt()
    fun getPoolPersist(): String? = findEntry("ifconfig-pool-persist")?.get(1)
    fun getClientToClient(): Boolean = findEntry("client-to-client") != null
    fun getProto(): Protocol = when (findEntry("proto")?.get(1)?.lowercase()) {
        "udp" -> Protocol.UDP
        "tcp" -> Protocol.TCP
        else -> null
    } ?: throw IllegalStateException("No Protocol defined in Server Config")

    fun getPort(): Int =
        findEntry("port")?.get(1)?.toInt() ?: throw IllegalStateException("No Port defined in Server Config")

    fun getServer(): ServerDefinition = findEntry("server")?.let {
        ServerDefinition(subnet = it[1], mask = it[2])
    } ?: throw IllegalStateException("No Server defined in Server Config")


    fun getPushOptions(): PushOptions = PushOptions(
        redirectAll = getRedirectAll(),
        dhcpOptions = getDHCPOptions(),
        routes = getRoutes()
    )

    fun getDHCPOptions(): List<DHCPOption> =
        findAllPushEntries("dhcp-option").map {
            DHCPOption(type = it[1], param = it[2])
        }

    fun getRoutes(): List<RouteDefinition> =
        findAllPushEntries("route").map {
            RouteDefinition(network = it[1], subnetMask = it[2])
        }

    fun getRedirectAll(): Boolean = findPushEntry("redirect-gateway") != null

    private fun findAllPushEntries(key: String) = pushEntries.filter { it.first() == key }
    private fun findPushEntry(key: String) = pushEntries.find { it.first() == key }
    private fun findEntry(key: String) = currentEntries.find { it.first() == key }

}