package dev.quetzalvpn.openvpn

import io.ktor.util.logging.*
import java.nio.file.Path

abstract class LineFile<EntriesType>(filePath: Path) {
    protected val LOGGER = KtorSimpleLogger(this::class.qualifiedName.orEmpty())

    protected val file = filePath.toFile()
    protected abstract var currentEntries: EntriesType


    protected fun getLines(): List<String> {
        LOGGER.info("Reading ${this::class.simpleName} file: ${file.absolutePath}")
        return file.readLines()
    }

    protected fun writeLines(lines: List<String>) {
        LOGGER.info("Writing ${this::class.simpleName} file: ${file.absolutePath}")
        file.writeText(lines.joinToString("\n") + "\n")
    }

    fun getEntries(): EntriesType {
        return this.currentEntries
    }


    abstract fun readEntries()
    abstract fun writeEntries()

}