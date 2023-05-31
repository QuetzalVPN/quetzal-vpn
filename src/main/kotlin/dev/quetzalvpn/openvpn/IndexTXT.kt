package dev.quetzalvpn.openvpn

import io.ktor.util.logging.*
import java.nio.file.Path


private val LOGGER = KtorSimpleLogger("dev.quetzalvpn.openvpn.IndexTXT")

data class IndexTXTEntry(
    val flag: String,
    val serial: String,
    val expirationDate: String,
    val revocationDate: String,
    val fileName: String,
    val distinguishedName: String,
) {
    val isRevoked: Boolean
        get() = this.flag == "R"
    val isExpired: Boolean
        get() = this.flag == "E"
    val isValid: Boolean
        get() = this.flag == "V"
    val commonName: String
        get() = this.distinguishedName.split("CN=").last()
}

class IndexTXT(private val indexTXTPath: Path) {

    companion object {
        const val INDEX_TXT_FLAG = 0
        const val INDEX_TXT_EXPIRATION_DATE = 1
        const val INDEX_TXT_REVOCATION_DATE = 2
        const val INDEX_TXT_SERIAL = 3
        const val INDEX_TXT_FILE_NAME = 4
        const val INDEX_TXT_DN = 5
    }

    private val indexTXTFile = indexTXTPath.toFile()
    private var entries: MutableList<IndexTXTEntry> = mutableListOf()

    init {
        readEntries()
    }

    private fun getLines(): List<String> {
        LOGGER.info("Reading index.txt file: ${indexTXTFile.absolutePath}")
        return indexTXTFile.readLines()
    }

    private fun writeLines(lines: List<String>) {
        LOGGER.info("Writing index.txt file: ${indexTXTFile.absolutePath}")
        indexTXTFile.writeText(lines.joinToString("\n") + "\n")
    }

    fun getEntries(): List<IndexTXTEntry> {
        return this.entries
    }

    private fun parseLine(line: String): IndexTXTEntry {
        val split = line.split("\t");
        return IndexTXTEntry(
            flag = split[INDEX_TXT_FLAG],
            expirationDate = split[INDEX_TXT_EXPIRATION_DATE],
            revocationDate = split[INDEX_TXT_REVOCATION_DATE],
            serial = split[INDEX_TXT_SERIAL],
            fileName = split[INDEX_TXT_FILE_NAME],
            distinguishedName = split[INDEX_TXT_DN],
        )
    }

    fun readEntries() {
        val lines = getLines()
        this.entries = lines.map {
            parseLine(it)
        }.toMutableList()
    }

    fun writeEntries() {
        val lines = entries.map {
            "${it.flag}\t${it.expirationDate}\t${it.revocationDate}\t${it.serial}\t${it.fileName}\t${it.distinguishedName}"
        }
        writeLines(lines)
    }

    fun getEntryByCommonName(commonName: String): IndexTXTEntry? {
        for (entry in entries) {
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
        val entry = entries[index]
        val newEntry = entry.copy(flag = "V", revocationDate = "")

        entries[index] = newEntry
        writeEntries()
    }

}