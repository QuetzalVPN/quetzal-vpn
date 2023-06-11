package dev.quetzalvpn.openvpn

import dev.quetzalvpn.plugins.LocalDateTimeSerializer
import io.ktor.util.logging.*
import kotlinx.serialization.Serializable
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.io.Writer
import java.net.Socket
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*


@Serializable
data class OpenVPNStatus(
    @Serializable(with = LocalDateTimeSerializer::class) val updated: LocalDateTime,
    val clients: List<OpenVPNClient>,
    val routes: List<OpenVPNRoutingTableRow>
)

@Serializable
data class OpenVPNClient(
    val commonName: String,
    val realAddress: String,
    val bytesReceived: Long,
    val bytesSent: Long,
    @Serializable(with = LocalDateTimeSerializer::class) val connectedSince: LocalDateTime
)

@Serializable
data class OpenVPNRoutingTableRow(
    val virtualAddress: String,
    val commonName: String,
    val realAddress: String,
    @Serializable(with = LocalDateTimeSerializer::class) val lastRef: LocalDateTime
)

class OpenVPNManagementClient(private val host: String, private val port: Int) {
    private val LOGGER = KtorSimpleLogger(this::class.qualifiedName.orEmpty());

    companion object {
        private val ovpnDateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
    }

    enum class Signals {
        SIGHUP, SIGTERM, SIGUSR1, SIGUSR2
    }

    private var socket: Socket = Socket(host, port) //TODO: reconnect/timeout
    private var writer: Writer = OutputStreamWriter(socket.getOutputStream())
    private var reader: Scanner = Scanner(InputStreamReader(socket.getInputStream()))


    private fun sendSignal(signal: Signals) {
        LOGGER.debug("Sending Signal ${signal.name}")
        executeCommand("signal ${signal.name}")
    }

    fun killClient(commonName: String) {
        LOGGER.debug("Killing Client $commonName")
        executeCommand("kill $commonName")
    }

    fun triggerLog() {
        LOGGER.debug("Triggering Log")
        sendSignal(Signals.SIGUSR2)
    }

    fun restartServer() {
        LOGGER.info("Restarting OpenVPN-Daemon")
        sendSignal(Signals.SIGHUP)
    }

    fun stopServer() {
        LOGGER.warn("Stopping OpenVPN-Daemon")
        sendSignal(Signals.SIGTERM)
    }

    fun status(): OpenVPNStatus {
        LOGGER.debug("Querying Status of OpenVPN")
        val output = executeCommandReadEnd("status")

        return parseStatus(output)
    }

    private fun parseStatus(output: String): OpenVPNStatus {
        val lines = output.split("\n")


        val clientListLabelIndex = lines.indexOf("OpenVPN CLIENT LIST")
        val updatedLineIndex = clientListLabelIndex + 1
        val clientListHeaderIndex = updatedLineIndex + 1

        val routingTableLabelIndex = lines.indexOf("ROUTING TABLE")
        val routingTableHeaderIndex = routingTableLabelIndex + 1
        val globalStatsLabelIndex = lines.indexOf("GLOBAL STATS")

        val clientListHeader = lines[clientListHeaderIndex]
        val clientListLines = lines.subList(clientListHeaderIndex + 1, routingTableLabelIndex)

        val routingTableHeader = lines[routingTableHeaderIndex]
        val routingTableLines = lines.subList(routingTableHeaderIndex + 1, globalStatsLabelIndex)

        return OpenVPNStatus(
            updated = parseUpdatedLine(lines[updatedLineIndex]),
            clients = parseClientList(clientListHeader, clientListLines),
            routes = parseRoutingTable(routingTableHeader, routingTableLines),
        )
    }

    private fun parseUpdatedLine(updatedLine: String): LocalDateTime {
        val parts = updatedLine.split(",")
        val dateString = parts[1]

        return LocalDateTime.parse(dateString, ovpnDateTimeFormatter)
    }

    private fun parseClientList(headerLine: String, clientLines: List<String>): List<OpenVPNClient> {
        val headers = headerLine.split(",")
        val commonNameIndex = headers.indexOf("Common Name")
        val realAddressIndex = headers.indexOf("Real Address")
        val bytesReceivedIndex = headers.indexOf("Bytes Received")
        val bytesSentIndex = headers.indexOf("Bytes Sent")
        val connectedSinceIndex = headers.indexOf("Connected Since")

        return clientLines.map {
            val parts = it.split(",")
            OpenVPNClient(
                commonName = parts[commonNameIndex],
                realAddress = parts[realAddressIndex],
                bytesReceived = parts[bytesReceivedIndex].toLong(),
                bytesSent = parts[bytesSentIndex].toLong(),
                connectedSince = LocalDateTime.parse(parts[connectedSinceIndex], ovpnDateTimeFormatter)
            )
        }
    }

    private fun parseRoutingTable(headerLine: String, routingTableLines: List<String>): List<OpenVPNRoutingTableRow> {
        val headers = headerLine.split(",")
        val virtualAddressIndex = headers.indexOf("Virtual Address")
        val commonNameIndex = headers.indexOf("Common Name")
        val realAddressIndex = headers.indexOf("Real Address")
        val lastRefIndex = headers.indexOf("Last Ref")

        return routingTableLines.map {
            val parts = it.split(",")
            OpenVPNRoutingTableRow(
                virtualAddress = parts[virtualAddressIndex],
                commonName = parts[commonNameIndex],
                realAddress = parts[realAddressIndex],
                lastRef = LocalDateTime.parse(parts[lastRefIndex], ovpnDateTimeFormatter)
            )
        }
    }


    private fun executeCommand(command: String) {
        writer.write("$command\r\n")
        writer.flush()
    }

    private fun executeCommandReadEnd(command: String): String {
        executeCommand(command)
        return readToEnd()
    }


    private fun readToEnd(): String {
        val sb = StringBuilder()

        var line = ""
        while (line != "END") {
            line = reader.nextLine()
            sb.append(line, "\n")
        }
        return sb.toString()
    }


}