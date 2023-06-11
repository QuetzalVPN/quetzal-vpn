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


}