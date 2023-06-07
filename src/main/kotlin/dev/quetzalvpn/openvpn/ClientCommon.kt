package dev.quetzalvpn.openvpn

import java.nio.file.Path


class ClientCommon(filePath: Path) : LineFile<MutableMap<String, List<String>>>(filePath) {

    override var currentEntries: MutableMap<String, List<String>> = mutableMapOf()

    init {
        readEntries()
    }

    override fun readEntries() {
        val lines = getLines()
        this.currentEntries = mutableMapOf()
        for (line in lines) {
            val split = line.split(" ")
            this.currentEntries[split[0]] = split
        }
    }

    override fun writeEntries() {
        val lines = currentEntries.map {
            it.key + " " + it.value.joinToString(" ")
        }
        writeLines(lines)
    }

}