package dev.quetzalvpn.openvpn

import java.io.BufferedReader
import java.nio.file.Path

class EasyRSA(private val binDir: Path, private val pkiDir: Path, private val configDir: Path) {

    private val easyRSAScript = binDir.resolve("easyrsa")

    private fun defaultProcessBuilder(command: List<String>): ProcessBuilder {
        return ProcessBuilder(command)
            .directory(pkiDir.toFile())
    }

    fun buildClientFull(name: String) {
        val command = listOf(easyRSAScript.toString(), "build-client-full", name)
        val process = defaultProcessBuilder(command)
            .start()
        process.waitFor()
        val text = process.inputStream.bufferedReader().use(BufferedReader::readText)
        println("Built client $name: $text")
    }

    fun revokeClient(name: String) {
        val command = listOf(easyRSAScript.toString(), "revoke", name)
        val process = defaultProcessBuilder(command)
            .start()
        process.waitFor()
    }

    fun getClientConfig(name: String): String {
        val command = listOf(configDir.resolve("createClientConfig.sh").toString(), name)
        val process = ProcessBuilder(command)
            .directory(configDir.toFile())
            .start()
        process.waitFor()
        return configDir.resolve("ccd").resolve(name).resolve("$name.ovpn").toFile().readText()
    }


}