package dev.quetzalvpn.openvpn

import java.nio.file.Path

class ServerConfig(filePath: Path) : LineFile<List<String>>(filePath) {

    init {
        readEntries()
    }

    // Some entries look like this: push "some params"
    // pushEntries are the "unzipped" push entries
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


    fun writeParsed(config: ServerConfigDTO) {
        readEntries()
        with(config) {
            setSimpleEntry("port", port)
            setSimpleEntry("proto", proto.name.lowercase())
            setSimpleEntry("server", listOf(server.subnet, server.mask))
            setSimpleEntry("ifconfig-pool-persist", poolPersist)
            setBooleanEntry("client-to-client", clientToClient)
            setSimpleEntry("explicit-exit-notify", if (explicitExitNotify) "1" else null)
            setSimpleEntry("keepalive", if (keepAlive == null) null else listOf(keepAlive.interval, keepAlive.timeout))
            setSimpleEntry("cipher", cipher)
            setSimpleEntry("max-clients", maxClients)
            setSimpleEntry("status", status)
            setLogEntry(log)
            setSimpleEntry("verb", verbosity)
            setPushOptions(pushOptions)
        }
        writeEntries()
    }


    private fun setPushOptions(pushOptions: PushOptions) {
        val pushEntries = this.pushEntries.toMutableList();


        if (pushOptions.redirectAll) {
            if (-1 == pushEntries.indexOfFirst { "redirect-gateway" == it.first() })
                pushEntries.add(listOf("redirect-gateway", "def1"))
        } else {
            pushEntries.removeIf { "redirect-gateway" == it.first() }
        }

        pushEntries.removeIf { it.first() == "route" || it.first() == "dhcp-option" }

        for (route in pushOptions.routes) {
            pushEntries.add(listOf("route", route.network, route.subnetMask))
        }
        for (option in pushOptions.dhcpOptions) {
            pushEntries.add(listOf("dhcp-option", option.type, option.param))
        }

        currentEntries.removeIf { it.first() == "push" }

        currentEntries.addAll(pushEntries.map {
            listOf("push", "\"${it.joinToString(" ")}\"")
        })
    }


    private fun setLogEntry(logDef: LogDefinition?) {
        currentEntries.removeIf { it.first() == "log" || it.first() == "log-append" }
        if (logDef == null) return;

        val key = if (logDef.append) "log-append" else "log"

        setSimpleEntry(key, logDef.fileName)
    }

    private fun setBooleanEntry(key: String, bool: Boolean) {
        if (bool) {
            if (-1 == currentEntries.indexOfFirst { key == it.first() })
                currentEntries.add(listOf(key))
        } else {
            currentEntries.removeIf { key == it.first() }
        }
    }

    private fun setSimpleEntry(key: String, params: List<Any>?) {
        if (params == null) {
            currentEntries.removeIf { key == it.first() }
            return
        }

        val index = currentEntries.indexOfFirst { key == it.first() }

        val entry = params.toMutableList().also {
            it.add(0, key)
        }.map { it.toString() }

        if (index != -1) {
            currentEntries[index] = entry
        } else {
            currentEntries.add(entry)
        }
    }

    private fun setSimpleEntry(key: String, param: Any?) {
        if (param == null) {
            currentEntries.removeIf { key == it.first() }
            return
        }
        val index = currentEntries.indexOfFirst { key == it.first() }
        val entry = listOf<String>(key, param.toString())
        if (index != -1) {
            currentEntries[index] = entry
        } else {
            currentEntries.add(entry)
        }
    }

    fun getParsed(): ServerConfigDTO = ServerConfigDTO(
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
    fun getKeepAlive(): KeepAliveDefinition? = findEntry("keepalive")?.let {
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