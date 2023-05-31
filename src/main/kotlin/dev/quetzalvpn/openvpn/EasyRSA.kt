package dev.quetzalvpn.openvpn

import io.ktor.util.logging.*
import java.io.File
import java.nio.file.Path
import java.util.concurrent.TimeUnit

private val LOGGER = KtorSimpleLogger("dev.quetzalvpn.openvpn.EasyRSA")
class EasyRSA(private val binDir: Path, private val pkiDir: Path, private val configDir: Path) {

    private val unrevokeScriptPath = configDir.resolve("unrevokeClient.sh")
    private val createClientConfigPath = configDir.resolve("createClientConfig.sh")

    private val easyRSAScriptPath = binDir.resolve("easyrsa")

    private val indexTXT: IndexTXT = IndexTXT(pkiDir.resolve("index.txt"))

    private fun defaultProcessBuilder(command: List<String>): ProcessBuilder {
        return ProcessBuilder(command)
            .directory(pkiDir.toFile())
    }

    fun buildClientFull(name: String) {
        LOGGER.debug("Building client full: $name")
        val command = listOf("/bin/sh", "-c", "echo yes | $easyRSAScriptPath build-client-full $name nopass")
        val process = defaultProcessBuilder(command)
            .start()

        process.waitFor(1000, TimeUnit.MILLISECONDS)
    }

    fun revokeClient(name: String): Boolean {
        LOGGER.debug("Revoking client: $name")
        indexTXT.readEntries()
        val entry = indexTXT.getEntryByCommonName(name) ?: return false
        if (entry.isRevoked) {
            LOGGER.warn("Client is already revoked: $name")
            return false
        }

        val command = listOf("/bin/sh", "-c", "echo yes | $easyRSAScriptPath revoke $name")
        val process = defaultProcessBuilder(command)
            .start()
        process.waitFor(5, TimeUnit.SECONDS)

        genCRL()
        return true
    }

    fun unrevokeClient(name: String): Boolean {
        LOGGER.debug("Unrevoking client: $name")
        indexTXT.readEntries()
        val entry = indexTXT.getEntryByCommonName(name) ?: return false

        if (!entry.isRevoked) {
            LOGGER.warn("Client is not revoked: $name")
            return false
        }

        val serial = entry.serial;
        val command = listOf(unrevokeScriptPath.toString(), name, serial)

        val process = defaultProcessBuilder(command)
            .start()
        process.waitFor(1, TimeUnit.SECONDS)

        indexTXT.setValid(name)
        genCRL()
        return true
    }

    fun genCRL() {
        LOGGER.debug("Generating CRL")
        val command = listOf("/bin/sh", "-c", "$easyRSAScriptPath gen-crl")
        val process = defaultProcessBuilder(command)
            .start()
        process.waitFor(1, TimeUnit.SECONDS)
        fixCRL()
    }

    fun fixCRL() {
        LOGGER.debug("Fixing CRL permissions")
        val command = listOf("/bin/sh", "-c", "chmod 0755 $pkiDir && chmod 0644 ${pkiDir.resolve("crl.pem")}");
        val process = defaultProcessBuilder(command)
            .start()
        process.waitFor(1, TimeUnit.SECONDS)
    }

    fun getClientConfig(name: String): File {
        LOGGER.debug("Generating client config for: $name")
        // generates client config file in configDir/ccd/name/name.ovpn
        val command = listOf(createClientConfigPath.toString(), name)
        val process = ProcessBuilder(command)
            .directory(configDir.toFile())
            .start()
        process.waitFor(5, TimeUnit.SECONDS)
        // return the generated file
        return configDir.resolve("ccd").resolve(name).resolve("$name.ovpn").toFile()
    }


}