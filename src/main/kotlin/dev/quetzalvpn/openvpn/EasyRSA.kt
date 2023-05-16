package dev.quetzalvpn.openvpn

import java.io.BufferedReader
import java.io.File
import java.nio.file.Path
import java.time.Duration
import java.util.concurrent.TimeUnit

class EasyRSA(private val binDir: Path, private val pkiDir: Path, private val configDir: Path) {

    private val easyRSAScript = binDir.resolve("easyrsa")

    private fun defaultProcessBuilder(command: List<String>): ProcessBuilder {
        return ProcessBuilder(command)
            .directory(pkiDir.toFile())
    }

    fun buildClientFull(name: String) {
        val command = listOf("/bin/sh","-c","yes yes | ${easyRSAScript.toString()} build-client-full $name nopass")
        val process = defaultProcessBuilder(command)
            .start()

        process.waitFor(1000, TimeUnit.MILLISECONDS)

        val cmdOut = process.inputStream.bufferedReader().use(BufferedReader::readText)
        println("\nBuilt client $name: $cmdOut\n")
    }

    fun revokeClient(name: String) {
        val command = listOf(easyRSAScript.toString(), "revoke", name)
        val process = defaultProcessBuilder(command)
            .start()
        process.waitFor()
    }

    fun getClientConfig(name: String): File {
        val command = listOf(configDir.resolve("createClientConfig.sh").toString(), name)
        val process = ProcessBuilder(command)
            .directory(configDir.toFile())
            .start()
        process.waitFor()
        return configDir.resolve("ccd").resolve(name).resolve("$name.ovpn").toFile()
    }


}