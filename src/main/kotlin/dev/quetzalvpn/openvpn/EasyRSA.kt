package dev.quetzalvpn.openvpn

import java.io.BufferedReader
import java.io.File
import java.nio.file.Path
import java.util.concurrent.TimeUnit

class EasyRSA(private val binDir: Path, private val pkiDir: Path, private val configDir: Path) {

    private val easyRSAScript = binDir.resolve("easyrsa")

    private fun defaultProcessBuilder(command: List<String>): ProcessBuilder {
        return ProcessBuilder(command)
            .directory(pkiDir.toFile())
    }

    fun buildClientFull(name: String) { // TODO: useful return code
        val command = listOf("/bin/sh", "-c", "echo yes | $easyRSAScript build-client-full $name nopass")
        val process = defaultProcessBuilder(command)
            .start()

        process.waitFor(1000, TimeUnit.MILLISECONDS)

        val cmdOut = process.inputStream.bufferedReader().use(BufferedReader::readText)
        println("\nBuilt client $name: $cmdOut\n") //TODO: don't log everything
    }

    fun revokeClient(name: String) {
        val command = listOf("/bin/sh", "-c", "echo yes | $easyRSAScript revoke $name")
        val process = defaultProcessBuilder(command)
            .start()
        process.waitFor(1, TimeUnit.SECONDS)
        genCRL()
    }

    fun unrevokeClient(name: String) {
        TODO("Implement unrevoking a client")
        // move revoked files to active directories and reload crl
//        val command = listOf("/bin/sh", "-c", "")
//        val process = defaultProcessBuilder(command)
//            .start()
//        process.waitFor(1, TimeUnit.SECONDS)
//        genCRL()
    }

    fun genCRL() {
        val command = listOf("/bin/sh", "-c", "$easyRSAScript gen-crl")
        val process = defaultProcessBuilder(command)
            .start()
        process.waitFor(1, TimeUnit.SECONDS)
        fixCRL()
    }

    fun fixCRL() {
        val command = listOf("/bin/sh", "-c", "chmod 0755 $pkiDir && chmod 0644 ${pkiDir.resolve("crl.pem")}");
        val process = defaultProcessBuilder(command)
            .start()
        process.waitFor(1, TimeUnit.SECONDS)
    }

    fun getClientConfig(name: String): File {
        val command = listOf(configDir.resolve("createClientConfig.sh").toString(), name)
        val process = ProcessBuilder(command)
            .directory(configDir.toFile())
            .start()
        process.waitFor(5, TimeUnit.SECONDS)
        return configDir.resolve("ccd").resolve(name).resolve("$name.ovpn").toFile()
    }


}