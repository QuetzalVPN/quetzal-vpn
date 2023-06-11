package dev.quetzalvpn.openvpn

import java.nio.file.Path


class IndexTXT(indexTXTPath: Path) : LineFile<IndexTXTEntry>(indexTXTPath) {

    companion object {
        const val INDEX_TXT_FLAG = 0
        const val INDEX_TXT_EXPIRATION_DATE = 1
        const val INDEX_TXT_REVOCATION_DATE = 2
        const val INDEX_TXT_SERIAL = 3
        const val INDEX_TXT_FILE_NAME = 4
        const val INDEX_TXT_DN = 5
    }


    init {
        readEntries()
    }

    private fun parseLine(line: String): IndexTXTEntry {
        val split = line.split("\t")
        return IndexTXTEntry(
            flag = split[INDEX_TXT_FLAG],
            expirationDate = split[INDEX_TXT_EXPIRATION_DATE],
            revocationDate = split[INDEX_TXT_REVOCATION_DATE],
            serial = split[INDEX_TXT_SERIAL],
            fileName = split[INDEX_TXT_FILE_NAME],
            distinguishedName = split[INDEX_TXT_DN],
        )
    }

    override fun readEntries() {
        val lines = getLines()
        this.currentEntries = lines.map {
            parseLine(it)
        }.toMutableList()
    }

    override fun writeEntries() {
        val lines = getEntries().map {
            "${it.flag}\t${it.expirationDate}\t${it.revocationDate}\t${it.serial}\t${it.fileName}\t${it.distinguishedName}"
        }
        writeLines(lines)
    }

    fun getEntryByCommonName(commonName: String): IndexTXTEntry? {
        for (entry in getEntries()) {
            if (entry.commonName == commonName) {
                return entry
            }
        }
        return null
    }

    fun getEntryBySerial(serial: String): IndexTXTEntry? {
        val entries = getEntries()
        for (entry in entries) {
            if (entry.serial == serial) {
                return entry
            }
        }
        return null
    }


    fun setValid(commonName: String) {

        val index = getEntries().indexOfLast {
            it.commonName == commonName
        }

        if (index == -1) {
            LOGGER.warn("Entry not found for commonName: $commonName")
            return
        }

        LOGGER.debug("Setting entry to valid for commonName: $commonName")
        val entry = currentEntries[index]
        val newEntry = entry.copy(flag = "V", revocationDate = "")

        currentEntries[index] = newEntry
        writeEntries()
    }

}