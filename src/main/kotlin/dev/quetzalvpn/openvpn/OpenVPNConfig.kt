package dev.quetzalvpn.openvpn

import java.nio.file.Path

class OpenVPNConfig(private val configPath: Path){

    private val file = configPath.toFile()

    fun readConfigRaw(): String {
        return file.readText()
    }

}