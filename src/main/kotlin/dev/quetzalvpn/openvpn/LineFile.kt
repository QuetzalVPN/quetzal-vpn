package dev.quetzalvpn.openvpn

import io.ktor.util.logging.*
import java.io.File
import java.nio.file.Path

abstract class LineFile<EntryType>(filePath: Path) {

    protected val LOGGER = KtorSimpleLogger(this::class.qualifiedName.orEmpty())

    companion object {
        @JvmStatic
        protected fun splitStringOnSpace(string: String): List<String> {
            val pattern = """("[^"]*"|\S+)""".toRegex()
            return pattern.findAll(string).map { it.value }.toList()
        }

        protected val commentChars: List<Char> = listOf(';', '#')
    }

    protected val file: File = filePath.toFile()
    protected var currentEntries: MutableList<EntryType> = mutableListOf()

    fun getRaw(): String = file.readText()

    protected fun getLines(): List<String> {
        LOGGER.info("Reading ${this::class.simpleName} file: ${file.absolutePath}")
        return file.readLines().filter { it.isNotEmpty() && !commentChars.contains(it.first()) }
    }

    protected fun writeLines(lines: List<String>) {
        LOGGER.info("Writing ${this::class.simpleName} file: ${file.absolutePath}")
        file.writeText(lines.joinToString("\n") + "\n")
    }

    fun getEntries(): List<EntryType> {
        return this.currentEntries
    }


    abstract fun readEntries()
    abstract fun writeEntries()

}