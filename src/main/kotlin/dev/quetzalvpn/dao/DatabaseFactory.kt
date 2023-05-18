package dev.quetzalvpn.dao

import com.zaxxer.hikari.HikariDataSource
import dev.quetzalvpn.models.LoginLogs
import dev.quetzalvpn.models.LoginUsers
import dev.quetzalvpn.models.VPNUsers
import io.ktor.server.config.*
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

object DatabaseFactory {
    fun init(config: ApplicationConfig) {
        val driverClassName = config.property("storage.driverClassName").getString()
        val jdbcURL = config.property("storage.jdbcURL").getString()
        val password = config.property("storage.password").getString()
        val database = Database.connect(createHikariDataSource(jdbcURL, driverClassName, password))
        transaction(database) {

            SchemaUtils.createMissingTablesAndColumns(LoginUsers)
            SchemaUtils.createMissingTablesAndColumns(LoginLogs)
            SchemaUtils.createMissingTablesAndColumns(VPNUsers)

        }
    }

    private fun createHikariDataSource(url: String, driver: String, pass: String) = HikariDataSource().apply {
        jdbcUrl = url
        driverClassName = driver
        maximumPoolSize = 3
        password = pass
        isAutoCommit = false
        transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        validate()
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}