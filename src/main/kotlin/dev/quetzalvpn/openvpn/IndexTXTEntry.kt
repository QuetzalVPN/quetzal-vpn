package dev.quetzalvpn.openvpn

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