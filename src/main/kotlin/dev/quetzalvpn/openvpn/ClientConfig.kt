package dev.quetzalvpn.openvpn

import java.nio.file.Path


class ClientConfig(filePath: Path) : LineFile<List<String>>(filePath) {

    init {
        readEntries()
    }

    override fun readEntries() =
        getLines()
            .map(Companion::splitStringOnSpace).toMutableList()
            .let { this.currentEntries = it }


    override fun writeEntries() =
        this.currentEntries
            .map { it.joinToString(" ") }
            .let { writeLines(it) }


    fun writeParsed(config: ClientConfigDTO) {
        readEntries()
        with(config) {
            setSimpleEntry("proto", proto.name.lowercase())
            setSimpleEntry("cipher", cipher)
            setSimpleEntry("remote", listOf(remote.host, remote.port))
        }
        writeEntries()
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

    fun getParsed(): ClientConfigDTO = ClientConfigDTO(
        proto = getProto(),
        cipher = getCipher(),
        remote = getRemote()
    )

    fun getRemote(): RemoteDefinition = findEntry("remote")?.let {
        if (it.size < 3) null
        else
            RemoteDefinition(
                host = it[1],
                port = it[2].toInt()
            )
    } ?: throw IllegalStateException("No Protocol defined in Client Config")

    fun getProto(): Protocol = when (findEntry("proto")?.get(1)?.lowercase()) {
        "udp" -> Protocol.UDP
        "tcp" -> Protocol.TCP
        else -> null
    } ?: throw IllegalStateException("No Protocol defined in Client Config")

    fun getCipher(): String? =
        findEntry("cipher")?.get(1)

    private fun findEntry(key: String) = currentEntries.find { it.first() == key }

}