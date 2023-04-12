package dev.quetzalvpn.openvpn

import java.nio.file.Path

class EasyRSA(private val baseDir: Path) {

    private val easyRSAScript = baseDir.resolve("easyrsa")

    fun buildClientFull(name: String){
        val command = listOf(easyRSAScript.toString(), "build-client-full", name)
        val process = ProcessBuilder(command)
                .directory(baseDir.toFile())
                .start()
        process.waitFor()
    }

    fun revokeClient(name: String){
        val command = listOf(easyRSAScript.toString(), "revoke", name)
        val process = ProcessBuilder(command)
                .directory(baseDir.toFile())
                .start()
        process.waitFor()
    }



}